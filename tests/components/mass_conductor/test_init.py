"""Tests for the Music Assistant Conductor setup and card-resource registration."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from custom_components.mass_conductor import (
    _async_register_card_resource,
    _async_register_frontend,
)
from custom_components.mass_conductor.const import DOMAIN, FRONTEND_URL_PATH


def _make_resources(items: list[dict]) -> MagicMock:
    """Build a Lovelace resources double backing the given stored items."""
    resources = MagicMock()
    resources.async_items = MagicMock(return_value=items)
    resources.async_create_item = AsyncMock()
    resources.async_update_item = AsyncMock()
    resources._async_ensure_loaded = AsyncMock()
    return resources


def _install_lovelace(hass: HomeAssistant, resources: MagicMock) -> None:
    """Attach a storage-mode Lovelace double exposing the given resources."""
    hass.data["lovelace"] = SimpleNamespace(
        resource_mode="storage", resources=resources
    )


async def _expected_url(hass: HomeAssistant) -> str:
    integration = await async_get_integration(hass, DOMAIN)
    return f"{FRONTEND_URL_PATH}?v={integration.version}"


async def test_register_card_resource_creates_when_absent(
    hass: HomeAssistant,
) -> None:
    """A missing card resource is created with the version-stamped URL."""
    resources = _make_resources([])
    _install_lovelace(hass, resources)

    await _async_register_card_resource(hass)

    url = await _expected_url(hass)
    resources.async_create_item.assert_awaited_once_with(
        {"res_type": "module", "url": url}
    )
    resources.async_update_item.assert_not_awaited()


async def test_register_card_resource_updates_when_url_stale(
    hass: HomeAssistant,
) -> None:
    """An existing resource with a stale version is updated in place."""
    stale = {"id": "res-1", "url": f"{FRONTEND_URL_PATH}?v=0.0.0-old"}
    resources = _make_resources([stale])
    _install_lovelace(hass, resources)

    await _async_register_card_resource(hass)

    url = await _expected_url(hass)
    resources.async_update_item.assert_awaited_once_with("res-1", {"url": url})
    resources.async_create_item.assert_not_awaited()


async def test_register_card_resource_noop_when_current(
    hass: HomeAssistant,
) -> None:
    """A resource already at the current URL is left untouched (no reload loop)."""
    url = await _expected_url(hass)
    resources = _make_resources([{"id": "res-1", "url": url}])
    _install_lovelace(hass, resources)

    await _async_register_card_resource(hass)

    resources.async_create_item.assert_not_awaited()
    resources.async_update_item.assert_not_awaited()


async def test_register_card_resource_url_uses_integration_version(
    hass: HomeAssistant,
) -> None:
    """The resource version comes from integration.version, not a timestamp."""
    resources = _make_resources([])
    _install_lovelace(hass, resources)

    await _async_register_card_resource(hass)

    integration = await async_get_integration(hass, DOMAIN)
    created_url = resources.async_create_item.await_args.args[0]["url"]
    assert created_url == f"{FRONTEND_URL_PATH}?v={integration.version}"
    assert created_url.endswith(f"?v={integration.version}")


async def test_register_card_resource_skips_when_not_storage_mode(
    hass: HomeAssistant,
) -> None:
    """Nothing is written when dashboards are not in storage mode."""
    resources = _make_resources([])
    hass.data["lovelace"] = SimpleNamespace(
        resource_mode="yaml", resources=resources
    )

    await _async_register_card_resource(hass)

    resources.async_create_item.assert_not_awaited()
    resources.async_update_item.assert_not_awaited()


async def test_frontend_registration_swallows_card_resource_errors(
    hass: HomeAssistant,
) -> None:
    """A failure while registering the card resource must not break setup."""
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    with patch(
        "custom_components.mass_conductor._async_register_card_resource",
        side_effect=RuntimeError("boom"),
    ):
        # Must not raise despite the card-resource registration failing.
        await _async_register_frontend(hass)

    hass.http.async_register_static_paths.assert_awaited_once()
