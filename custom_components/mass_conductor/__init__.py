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

    js_path = Path(__file__).parent / "frontend" / FRONTEND_FILENAME
    if not js_path.is_file():
        LOGGER.warning(
            "Bundled card %s not found; add the Lovelace resource manually", js_path
        )
        return

    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_PATH, str(js_path), cache_headers=False)]
    )
    # Cache-bust on file mtime so a rebuilt card is picked up after a restart.
    version = int(js_path.stat().st_mtime)
    add_extra_js_url(hass, f"{FRONTEND_URL_PATH}?v={version}")
