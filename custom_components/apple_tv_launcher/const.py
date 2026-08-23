"""Constants for Apple TV Launcher."""

from typing import Final

DOMAIN: Final = "apple_tv_launcher"
NAME: Final = "Apple TV Launcher"

CARD_FILENAME: Final = "apple-tv-launcher-card.js"
CARD_VERSION: Final = "0.1.0"
FRONTEND_URL_BASE: Final = f"/api/{DOMAIN}"
CARD_URL: Final = f"{FRONTEND_URL_BASE}/{CARD_FILENAME}"

COMMAND_CACHE_ARTWORK: Final = f"{DOMAIN}/cache_artwork"
ARTWORK_DIRECTORY: Final = "apple-tv-launcher-artwork"
MAX_ARTWORK_BYTES: Final = 5 * 1024 * 1024
ARTWORK_MAX_AGE_SECONDS: Final = 30 * 24 * 60 * 60
