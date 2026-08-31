"""Tests for the Music Assistant Conductor config flow."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.mass_conductor.const import DOMAIN, MASS_DOMAIN


async def test_abort_when_music_assistant_missing(hass: HomeAssistant) -> None:
    """The flow aborts when the official Music Assistant integration is absent."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "music_assistant_required"


async def test_abort_when_already_configured(hass: HomeAssistant) -> None:
    """Only a single Conductor entry is allowed."""
    MockConfigEntry(domain=DOMAIN).add_to_hass(hass)
    MockConfigEntry(domain=MASS_DOMAIN).add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "single_instance_allowed"


async def test_happy_path_creates_entry(hass: HomeAssistant) -> None:
    """With Music Assistant present, confirming the form creates the entry."""
    MockConfigEntry(domain=MASS_DOMAIN).add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Music Assistant Conductor"
    assert result["data"] == {}
