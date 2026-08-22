"""The Apple TV Launcher integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .artwork_cache import async_create_cache, async_register_websocket_command
from .const import DOMAIN
from .frontend import async_register_frontend

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, _config: ConfigType) -> bool:
    """Set up integration-wide frontend and artwork-cache services."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["artwork_cache"] = await async_create_cache(hass)
    async_register_websocket_command(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(_hass: HomeAssistant, _entry: ConfigEntry) -> bool:
    """Set up the single config entry."""
    return True


async def async_unload_entry(_hass: HomeAssistant, _entry: ConfigEntry) -> bool:
    """Unload the config entry."""
    return True
