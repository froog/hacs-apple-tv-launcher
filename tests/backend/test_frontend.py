"""Tests for Lovelace resource registration."""

from __future__ import annotations

from dataclasses import dataclass
from unittest.mock import AsyncMock

import pytest

from custom_components.apple_tv_launcher.const import CARD_URL, CARD_VERSION
from custom_components.apple_tv_launcher.frontend import _async_add_resource


class FakeResources:
    """Minimal storage resource collection."""

    def __init__(self, items=None) -> None:
        self.items = items or []
        self.async_get_info = AsyncMock()
        self.async_create_item = AsyncMock()
        self.async_update_item = AsyncMock()

    def async_items(self):
        """Return stored resources."""
        return self.items


@dataclass
class FakeLovelaceData:
    """Current Home Assistant Lovelace data shape."""

    resource_mode: str
    resources: FakeResources


@pytest.mark.asyncio
async def test_creates_missing_resource() -> None:
    """The card is added once in resource storage mode."""
    resources = FakeResources()
    hass = type(
        "FakeHass",
        (),
        {"data": {"lovelace": FakeLovelaceData("storage", resources)}},
    )()

    await _async_add_resource(hass)

    resources.async_create_item.assert_awaited_once_with(
        {"res_type": "module", "url": f"{CARD_URL}?v={CARD_VERSION}"}
    )


@pytest.mark.asyncio
async def test_updates_existing_resource_without_duplicate() -> None:
    """An old cache-busting URL is updated in place."""
    resources = FakeResources(
        [{"id": "one", "url": f"{CARD_URL}?v=0.0.1", "res_type": "module"}]
    )
    hass = type(
        "FakeHass",
        (),
        {"data": {"lovelace": FakeLovelaceData("storage", resources)}},
    )()

    await _async_add_resource(hass)

    resources.async_update_item.assert_awaited_once_with(
        "one", {"res_type": "module", "url": f"{CARD_URL}?v={CARD_VERSION}"}
    )
    resources.async_create_item.assert_not_awaited()
