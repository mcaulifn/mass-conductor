"""Tests for the Music Assistant Conductor WebSocket passthrough."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.mass_conductor.const import (
    WS_TYPE_COMMAND,
    WS_TYPE_SUBSCRIBE_EVENTS,
)
from custom_components.mass_conductor.websocket_api import async_register_websocket_api


@pytest.fixture(autouse=True)
async def register_ws_api(hass: HomeAssistant) -> None:
    """Register the passthrough WebSocket commands for every test."""
    async_register_websocket_api(hass)


@pytest.mark.parametrize(
    "command",
    [
        "players/toggle",
        "players/cmd/volume_set",
        "providers",
        "music/search",
        "music/browse",
        "player_queues/play_media",
    ],
)
async def test_command_allowed_is_forwarded(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mass_entry: MockConfigEntry,
    mass_client: MagicMock,
    command: str,
) -> None:
    """Safelisted commands are forwarded to MA and their result returned."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": WS_TYPE_COMMAND, "command": command})
    response = await client.receive_json()

    assert response["success"] is True
    assert response["result"] == {"result": "ok"}
    mass_client.send_command.assert_awaited_once_with(command)


async def test_command_rejected_when_not_on_safelist(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mass_entry: MockConfigEntry,
    mass_client: MagicMock,
) -> None:
    """A command outside the safelist is rejected without touching MA."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": WS_TYPE_COMMAND, "command": "config/providers/set"}
    )
    response = await client.receive_json()

    assert response["success"] is False
    assert response["error"]["code"] == "not_allowed"
    mass_client.send_command.assert_not_awaited()


async def test_command_args_are_forwarded_as_kwargs(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mass_entry: MockConfigEntry,
    mass_client: MagicMock,
) -> None:
    """The args dict is spread onto send_command as keyword arguments."""
    client = await hass_ws_client(hass)
    args = {"player_id": "abc", "volume_level": 42}
    await client.send_json_auto_id(
        {"type": WS_TYPE_COMMAND, "command": "players/cmd/volume_set", "args": args}
    )
    response = await client.receive_json()

    assert response["success"] is True
    mass_client.send_command.assert_awaited_once_with(
        "players/cmd/volume_set", player_id="abc", volume_level=42
    )


async def test_command_not_ready_without_loaded_mass_entry(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
) -> None:
    """Without a loaded Music Assistant entry the command reports not_ready."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": WS_TYPE_COMMAND, "command": "providers"}
    )
    response = await client.receive_json()

    assert response["success"] is False
    assert response["error"]["code"] == "not_ready"


async def test_command_failed_when_send_command_raises(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mass_entry: MockConfigEntry,
    mass_client: MagicMock,
) -> None:
    """An error raised by MA is surfaced to the card as command_failed."""
    mass_client.send_command.side_effect = RuntimeError("boom")
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": WS_TYPE_COMMAND, "command": "providers"}
    )
    response = await client.receive_json()

    assert response["success"] is False
    assert response["error"]["code"] == "command_failed"
    assert "boom" in response["error"]["message"]


async def test_subscribe_events_uses_event_filter_tuple(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
    mass_entry: MockConfigEntry,
    mass_client: MagicMock,
) -> None:
    """Regression: subscribe is called with a single event_filter tuple, not varargs.

    The shipped bug passed each EventType as a positional argument, which the MA
    client treats as (event_filter, id_filter, ...). The filter must be one tuple.
    """
    from music_assistant_models.enums import EventType

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": WS_TYPE_SUBSCRIBE_EVENTS})
    response = await client.receive_json()

    assert response["success"] is True
    mass_client.subscribe.assert_called_once()

    call = mass_client.subscribe.call_args
    # Exactly two positional args: (callback, event_filter). No varargs of EventTypes.
    assert len(call.args) == 2
    assert not call.kwargs
    callback, event_filter = call.args
    assert callable(callback)
    assert isinstance(event_filter, tuple)
    assert all(isinstance(item, EventType) for item in event_filter)


async def test_subscribe_events_not_ready_without_loaded_mass_entry(
    hass: HomeAssistant,
    hass_ws_client: WebSocketGenerator,
) -> None:
    """Subscribing without a loaded MA entry reports not_ready."""
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": WS_TYPE_SUBSCRIBE_EVENTS})
    response = await client.receive_json()

    assert response["success"] is False
    assert response["error"]["code"] == "not_ready"
