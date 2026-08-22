# Apple TV Launcher

A tvOS-inspired Home Assistant dashboard card that discovers and launches the
apps installed on an Apple TV. The card and its small persistent artwork cache
are distributed together as one HACS custom integration.

The launcher uses Home Assistant's built-in Apple TV integration for app
discovery, power, and launching. Apple TV credentials never enter the browser or
this integration.

> This project is independent and is not affiliated with or endorsed by Apple.
> Apple TV and tvOS are trademarks of Apple Inc. Other app names and trademarks
> belong to their respective owners.

## Features

- Discovers app names and bundle identifiers through Home Assistant media
  browsing, with `source_list` as a fallback.
- Launches an app after waking the Apple TV, with at most one bounded retry.
- Provides a touch-first, keyboard-accessible grid and a visual card editor.
- Supports 2–10 desktop columns and 2–6 mobile columns.
- Resolves optional App Store artwork and persists validated Marketing Tools PNGs
  under Home Assistant's `/config/www/apple-tv-launcher-artwork/` directory.
- Remains fully usable with artwork lookup disabled by rendering deterministic
  local brand-color and initials tiles.
- Supports name/bundle-ID ordering, filtering, and custom artwork overrides.

## Requirements

- Home Assistant 2025.7.0 or newer.
- The built-in [Apple TV integration](https://www.home-assistant.io/integrations/apple_tv/)
  configured with Companion protocol credentials.
- An Apple TV exposed as a `media_player` entity with launchable sources.

## Installation

### HACS

Until the repository is included in HACS defaults:

1. Open HACS and choose **Custom repositories**.
2. Add `https://github.com/froog/hacs-apple-launcher` as an **Integration**.
3. Install **Apple TV Launcher** and restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration**, search for
   **Apple TV Launcher**, and add it once.

Adding the integration serves the bundled card and registers its Lovelace module
resource automatically when dashboard resources use storage mode.

If your resources are YAML-managed, add this module manually:

```yaml
lovelace:
  resources:
    - url: /api/apple_tv_launcher/apple-tv-launcher-card.js?v=0.1.0
      type: module
```

### Manual

Copy `custom_components/apple_tv_launcher` into Home Assistant's
`/config/custom_components/`, restart, then add the integration from **Settings →
Devices & services**.

## Card setup

Add **Custom: Apple TV Launcher Card** in the dashboard editor and choose the
Apple TV media player. A minimal YAML configuration is:

```yaml
type: custom:apple-tv-launcher-card
entity: media_player.lounge_room
```

A fuller example:

```yaml
type: custom:apple-tv-launcher-card
entity: media_player.lounge_room
title: Lounge Apple TV
columns: 5
mobile_columns: 3
show_labels: true
artwork_lookup: true
artwork_country: nz
wake_before_launch: true
wake_delay: 2500
retry: true
app_order:
  - TVNZ+
  - ThreeNow
  - Netflix
  - com.amazon.aiv.AIVApp
exclude:
  - Computers
  - Search
  - Settings
artwork:
  com.example.app: /local/apple-tv/example.png
```

### Options

| Option               | Default     | Description                                          |
| -------------------- | ----------- | ---------------------------------------------------- |
| `entity`             | Required    | Apple TV `media_player` entity.                      |
| `title`              | Entity name | Heading; an empty value hides the heading.           |
| `columns`            | `5`         | Desktop icons per row, from 2–10.                    |
| `mobile_columns`     | `3`         | Icons per row below 600 px, from 2–6.                |
| `show_labels`        | `true`      | Show app names below icons.                          |
| `artwork_lookup`     | `true`      | Allow Apple artwork and App Store metadata requests. |
| `artwork_country`    | `us`        | Preferred two-letter App Store storefront.           |
| `wake_before_launch` | `true`      | Call `media_player.turn_on` before launching.        |
| `wake_delay`         | `2500`      | Milliseconds to wait after each wake command.        |
| `retry`              | `true`      | Retry one failed launch after one more wake.         |
| `app_order`          | `[]`        | Pin names or bundle IDs first, in order.             |
| `include`            | `[]`        | If set, show only these names or bundle IDs.         |
| `exclude`            | `[]`        | Hide these names or bundle IDs.                      |
| `artwork`            | `{}`        | Map app names or bundle IDs to custom image URLs.    |

Ordering, filtering, and artwork overrides are YAML-only advanced settings in
v0.1.0. Common settings are available in the visual editor.

## Artwork and privacy

Artwork lookup is optional. When enabled, the browser sends each bundle ID to
Apple's iTunes Lookup endpoint. Once a numeric App Store ID is found, the
authenticated card asks the integration to download a PNG from Apple's Marketing
Tools endpoint. The cache accepts only positive numeric IDs and two-letter
storefronts, validates PNG responses, limits each file to 5 MB, limits the cache
to 500 files, and writes atomically.

Disable `artwork_lookup` for no automatic Apple network requests. User-supplied
artwork URLs are still loaded because they are explicit configuration.

Delete an individual PNG from
`/config/www/apple-tv-launcher-artwork/` and reload the dashboard to deliberately
refresh it.

## Apple TV support

The launcher depends on the app-list and launch behavior exposed by Home
Assistant's built-in Apple TV integration.

| Apple TV model                | tvOS version     | Status             |
| ----------------------------- | ---------------- | ------------------ |
| Apple TV HD (4th generation)  | Latest available | Planned validation |
| Apple TV 4K (1st generation)  | Latest available | Planned validation |
| Apple TV 4K (2nd generation)  | Latest available | Planned validation |
| Apple TV 4K (3rd generation)  | tvOS 26.6        | Prototype verified |
| Future Apple TV/tvOS releases | Current release  | Best effort        |

Only the listed prototype combination has been exercised on hardware so far.
See [TODO.md](TODO.md) for the release-validation matrix.

## Troubleshooting

### No apps appear

Confirm the built-in Apple TV integration is connected and Companion-paired. The
card first uses `media_player/browse_media`, then falls back to the entity's
`source_list`.

### A newly installed app is missing

Home Assistant may retain the Apple TV app inventory until that config entry
reconnects. Go to **Settings → Devices & services → Apple TV → Reload**. A Home
Assistant restart is not required.

### The card is not available in the dashboard editor

Refresh the Home Assistant frontend after adding the integration. For YAML-mode
resources, confirm the module URL from the installation section is present.

### An app does not launch

Increase `wake_delay` for an Apple TV that wakes slowly. Launching is deliberately
bounded: the card never retries more than once.

## Repository layout

```text
custom_components/apple_tv_launcher/  Complete HACS-installed runtime package
  frontend/                            Compiled Lovelace card
  brand/                               HACS/Home Assistant brand assets
  translations/                        Custom-integration translations
src/                                   TypeScript/Lit card source
tests/frontend/                        Card unit/component tests
tests/backend/                         Home Assistant integration tests
.github/workflows/                     HACS, hassfest, build and release checks
```

The root-level source, tests, and build configuration are development-only. Run
`npm ci && npm run check` for the card. Install `requirements_test.txt`, then run
`pytest` and `ruff check custom_components tests/backend` for the backend.

## License

[MIT](LICENSE)
