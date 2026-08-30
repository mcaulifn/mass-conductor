"""Music Assistant Conductor integration.

Reuses the connection the official Music Assistant integration already holds, and
exposes a tiny safelisted passthrough over Home Assistant's own authenticated
WebSocket so the Lovelace card can talk to Music Assistant. No separate token or
server URL is needed.
"""

from __future__ import annotations

from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, FRONTEND_FILENAME, FRONTEND_URL_PATH, LOGGER
from .websocket_api import async_register_websocket_api


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the WebSocket API and serve the bundled card (once)."""
    if hass.data.get(DOMAIN):
        return True
    hass.data[DOMAIN] = True
    async_register_websocket_api(hass)
    await _async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up from a config entry. Nothing per-entry: the card reaches Music
    Assistant through the official integration's connection at call time."""
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the bundled card JS and register it as a frontend module."""
    from homeassistant.components.frontend import add_extra_js_url
    from homeassistant.components.http import StaticPathConfig
    from homeassistant.loader import async_get_integration

    js_path = Path(__file__).parent / "frontend" / FRONTEND_FILENAME
    if not await hass.async_add_executor_job(js_path.is_file):
        LOGGER.warning(
            "Bundled card %s not found; add the Lovelace resource manually", js_path
        )
        return

    # Serve the module cacheable; the version query below busts it when needed.
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_PATH, str(js_path))]
    )
    # Cache-bust on the integration version (stable across restarts) so clients
    # refresh exactly once per release, not on every restart/file re-extract.
    integration = await async_get_integration(hass, DOMAIN)
    add_extra_js_url(hass, f"{FRONTEND_URL_PATH}?v={integration.version}")
