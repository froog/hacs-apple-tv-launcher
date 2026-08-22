"""Serve and register the Apple TV Launcher card."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
from homeassistant.core import HomeAssistant

from .const import CARD_URL, CARD_VERSION, FRONTEND_URL_BASE

_LOGGER = logging.getLogger(__name__)


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Expose the bundle and add it to storage-mode dashboard resources."""
    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_BASE, str(frontend_dir), False)]
    )

    try:
        await _async_add_resource(hass)
    except Exception:
        _LOGGER.exception(
            "Could not register the card resource; add `%s?v=%s` manually",
            CARD_URL,
            CARD_VERSION,
        )


async def _async_add_resource(hass: HomeAssistant) -> None:
    """Create or update one Lovelace module resource without duplicates."""
    lovelace_data = hass.data.get(LOVELACE_DATA)
    mode = _data_value(lovelace_data, "resource_mode")
    if lovelace_data is None or mode != MODE_STORAGE:
        _LOGGER.warning(
            "Dashboard resources use %s mode; add `%s?v=%s` manually",
            mode or "an unknown",
            CARD_URL,
            CARD_VERSION,
        )
        return

    resources = _data_value(lovelace_data, "resources")
    if resources is None:
        raise RuntimeError("Lovelace resource collection is unavailable")

    await resources.async_get_info()
    target_url = f"{CARD_URL}?v={CARD_VERSION}"
    existing = [
        item
        for item in resources.async_items()
        if str(item.get("url", "")).split("?", 1)[0] == CARD_URL
    ]

    if existing:
        current = existing[0]
        if current.get("url") != target_url or current.get("res_type") != "module":
            await resources.async_update_item(
                current["id"], {"res_type": "module", "url": target_url}
            )
        return

    await resources.async_create_item({"res_type": "module", "url": target_url})


def _data_value(data: Any, key: str) -> Any:
    """Read current dataclass-style and older mapping-style Lovelace data."""
    if data is None:
        return None
    value = getattr(data, key, None)
    if value is not None:
        return value
    if isinstance(data, dict):
        if key == "resource_mode":
            return data.get("resource_mode", data.get("mode"))
        return data.get(key)
    return None
