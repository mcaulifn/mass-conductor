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
    """Serve the bundled card JS and register it as a Lovelace resource."""
    from homeassistant.components.http import StaticPathConfig

    js_path = Path(__file__).parent / "frontend" / FRONTEND_FILENAME
    if not await hass.async_add_executor_job(js_path.is_file):
        LOGGER.warning(
            "Bundled card %s not found; add the Lovelace resource manually", js_path
        )
        return

    # Serve the module cacheable; the version query on the resource busts it.
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_PATH, str(js_path))]
    )
    # Registering the card as a Lovelace resource (the way HACS ships frontend
    # cards) is idempotent and does not touch the frontend entrypoint, so it
    # avoids the "new version available" reload loop that add_extra_js_url can
    # cause. Fully guarded: a failure here must never break setup.
    try:
        await _async_register_card_resource(hass)
    except Exception:  # noqa: BLE001 - card registration is best-effort
        LOGGER.exception(
            "Could not auto-register the Conductor card. Add it manually under "
            "Settings > Dashboards > Resources: %s (JavaScript Module)",
            FRONTEND_URL_PATH,
        )


async def _async_register_card_resource(hass: HomeAssistant) -> None:
    """Add (or update) the card as a Lovelace storage-mode resource, idempotently."""
    from homeassistant.loader import async_get_integration

    integration = await async_get_integration(hass, DOMAIN)
    url = f"{FRONTEND_URL_PATH}?v={integration.version}"

    lovelace = hass.data.get("lovelace")
    if lovelace is None or getattr(lovelace, "resource_mode", None) != "storage":
        LOGGER.warning(
            "Dashboards are not in storage mode; add the Conductor card resource "
            "manually under Settings > Dashboards > Resources: %s (JavaScript Module)",
            FRONTEND_URL_PATH,
        )
        return

    resources = lovelace.resources
    ensure_loaded = getattr(resources, "_async_ensure_loaded", None)
    if ensure_loaded is not None:
        await ensure_loaded()

    for item in resources.async_items():
        if str(item.get("url", "")).split("?", 1)[0] == FRONTEND_URL_PATH:
            if item.get("url") != url:
                await resources.async_update_item(item["id"], {"url": url})
            return

    await resources.async_create_item({"res_type": "module", "url": url})
    LOGGER.info("Registered the Music Assistant Conductor card as a Lovelace resource")
