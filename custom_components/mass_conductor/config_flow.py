"""Config flow for the Music Assistant Conductor integration.

There is nothing to configure — the integration reuses the official Music
Assistant integration's connection — so this is a single confirmation step.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN, MASS_DOMAIN

DEFAULT_TITLE = "Music Assistant Conductor"


class MassConductorConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for the Music Assistant Conductor."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm setup; requires the official Music Assistant integration."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if not self.hass.config_entries.async_entries(MASS_DOMAIN):
            return self.async_abort(reason="music_assistant_required")
        if user_input is None:
            return self.async_show_form(step_id="user")
        return self.async_create_entry(title=DEFAULT_TITLE, data={})
