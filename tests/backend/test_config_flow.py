"""Tests for the Apple TV Launcher config flow."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.apple_tv_launcher.config_flow import AppleTvLauncherConfigFlow
from custom_components.apple_tv_launcher.const import DOMAIN


async def test_user_flow_creates_entry(hass: HomeAssistant) -> None:
    """The configuration-free flow creates the integration entry."""
    flow = AppleTvLauncherConfigFlow()
    flow.hass = hass
    flow.context = {}
    result = await flow.async_step_user()

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Apple TV Launcher"
    assert result["data"] == {}


async def test_user_flow_allows_only_one_entry(
    hass: HomeAssistant,
) -> None:
    """A second config entry is rejected."""
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)

    flow = AppleTvLauncherConfigFlow()
    flow.hass = hass
    flow.context = {}
    result = await flow.async_step_user()

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
