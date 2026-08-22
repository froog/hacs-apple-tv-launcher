"""Config flow for Apple TV Launcher."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN, NAME


class AppleTvLauncherConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the integration's single, configuration-free entry."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Set up Apple TV Launcher from the integrations UI."""
        if self._async_current_entries():
            return self.async_abort(reason="already_configured")
        return self.async_create_entry(title=NAME, data={})
