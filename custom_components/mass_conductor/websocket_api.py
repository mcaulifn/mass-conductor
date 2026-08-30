"""WebSocket API passthrough for the Music Assistant Conductor.

The browser talks only to Home Assistant over its authenticated same-origin
connection. These handlers forward a safelisted subset of MA commands to the
connection held by the official Music Assistant integration, and stream MA
events back to the card.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback

from .const import (
    ALLOWED_COMMAND_PREFIXES,
    ALLOWED_COMMANDS_EXACT,
    MASS_DOMAIN,
    WS_TYPE_COMMAND,
    WS_TYPE_SUBSCRIBE_EVENTS,
)

if TYPE_CHECKING:
    from music_assistant_client import MusicAssistantClient
    from music_assistant_models.event import MassEvent


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register the card's WebSocket API commands."""
    websocket_api.async_register_command(hass, ws_command)
    websocket_api.async_register_command(hass, ws_subscribe_events)


def _is_allowed(command: str) -> bool:
    """Return whether a command is on the passthrough safelist."""
    return command in ALLOWED_COMMANDS_EXACT or command.startswith(
        ALLOWED_COMMAND_PREFIXES
    )


@callback
def _get_client(hass: HomeAssistant) -> MusicAssistantClient | None:
    """Return the client from the official Music Assistant integration, if loaded."""
    for entry in hass.config_entries.async_entries(MASS_DOMAIN):
        if entry.state is ConfigEntryState.LOADED and (
            data := getattr(entry, "runtime_data", None)
        ):
            return data.mass
    return None


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_COMMAND,
        vol.Required("command"): str,
        vol.Optional("args"): dict,
    }
)
@websocket_api.async_response
async def ws_command(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Forward a safelisted MA command and return its result."""
    command: str = msg["command"]
    if not _is_allowed(command):
        connection.send_error(msg["id"], "not_allowed", f"Command not allowed: {command}")
        return

    mass = _get_client(hass)
    if mass is None:
        connection.send_error(msg["id"], "not_ready", "Music Assistant is not connected")
        return

    args = msg.get("args") or {}
    try:
        result = await mass.send_command(command, **args)
    except Exception as err:  # noqa: BLE001 - surface any MA error to the card
        connection.send_error(msg["id"], "command_failed", str(err))
        return

    connection.send_result(msg["id"], result)


@callback
@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_SUBSCRIBE_EVENTS})
def ws_subscribe_events(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Stream MA player/queue events to the browser."""
    from music_assistant_models.enums import EventType

    mass = _get_client(hass)
    if mass is None:
        connection.send_error(msg["id"], "not_ready", "Music Assistant is not connected")
        return

    @callback
    def _forward(event: MassEvent) -> None:
        # event.to_dict() yields the {event, object_id, data} wire shape the card
        # already understands, with `data` serialized to plain JSON.
        connection.send_message(websocket_api.event_message(msg["id"], event.to_dict()))

    connection.subscriptions[msg["id"]] = mass.subscribe(
        _forward,
        EventType.PLAYER_UPDATED,
        EventType.PLAYER_ADDED,
        EventType.PLAYER_REMOVED,
        EventType.QUEUE_UPDATED,
    )
    connection.send_result(msg["id"])
