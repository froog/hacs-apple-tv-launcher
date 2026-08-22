"""Tests for integration setup."""

from __future__ import annotations

from unittest.mock import AsyncMock, Mock, patch

from custom_components.apple_tv_launcher import async_setup
from custom_components.apple_tv_launcher.const import DOMAIN


async def test_async_setup_registers_runtime_services() -> None:
    """Integration setup creates the cache, command, and card resource."""
    hass = Mock()
    hass.data = {}
    cache = object()

    with (
        patch(
            "custom_components.apple_tv_launcher.async_create_cache",
            AsyncMock(return_value=cache),
        ) as create_cache,
        patch(
            "custom_components.apple_tv_launcher.async_register_websocket_command"
        ) as register_command,
        patch(
            "custom_components.apple_tv_launcher.async_register_frontend", AsyncMock()
        ) as register_frontend,
    ):
        assert await async_setup(hass, {})

    assert hass.data[DOMAIN]["artwork_cache"] is cache
    create_cache.assert_awaited_once_with(hass)
    register_command.assert_called_once_with(hass)
    register_frontend.assert_awaited_once_with(hass)
