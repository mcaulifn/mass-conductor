"""Shared fixtures for the Music Assistant Conductor tests."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    MockModule,
    mock_integration,
)

from custom_components.mass_conductor.const import MASS_DOMAIN


@pytest.fixture
def mass_client() -> MagicMock:
    """Return a fake Music Assistant client with the surface the passthrough uses."""
    mass = MagicMock()
    # send_command is awaited and its result is returned to the card.
    mass.send_command = AsyncMock(return_value={"result": "ok"})
    # subscribe is synchronous and returns an unsubscribe callable.
    mass.subscribe = MagicMock(return_value=MagicMock())
    return mass


@pytest.fixture
async def mass_entry(hass: HomeAssistant, mass_client: MagicMock) -> MockConfigEntry:
    """Register a loaded, official Music Assistant config entry exposing the client."""
    # Stub the real music_assistant integration so marking the entry LOADED does
    # not pull in music_assistant_client at teardown-unload time.
    mock_integration(
        hass,
        MockModule(
            MASS_DOMAIN,
            async_setup_entry=AsyncMock(return_value=True),
            async_unload_entry=AsyncMock(return_value=True),
        ),
    )
    entry = MockConfigEntry(domain=MASS_DOMAIN, title="Music Assistant")
    entry.add_to_hass(hass)
    entry.runtime_data = SimpleNamespace(mass=mass_client)
    entry.mock_state(hass, ConfigEntryState.LOADED)
    return entry
