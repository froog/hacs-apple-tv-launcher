# TODO

## Design

 - [ ] BRAND_STYLES fallbacks are too app specific, needs to have more generic fallback.
 - [ ] BUILTIN_ARTWORK needs work - needs better design for some icons, and support for other versions of Apple TV os Icon assets
 - [ ] Caching needs checking too
 - [ ] Need to support multiple Apple TVs

## Repository structure and publishing

- [x] Create a standalone `hacs-apple-launcher` Git repository.
- [x] Keep the complete installed runtime under
      `custom_components/apple_tv_launcher/`.
- [x] Add HACS metadata and declare the repository as an integration package.
- [x] Add Home Assistant manifest metadata, including documentation, issue tracker,
      code owner, version and minimum supported Home Assistant release.
- [x] Add validation workflows for HACS, hassfest, Python and frontend code.
- [x] Add release packaging for `apple_tv_launcher.zip`.
- [x] Add original brand artwork in the required `brand/icon.png` format.
- [ ] Confirm the GitHub repository description and topics before publication.
- [ ] Submit brand assets and the repository to the applicable HACS indexes after
      the first public release.

## Home Assistant integration

- [x] Add a single-entry, UI-based config flow.
- [x] Register the compiled Lovelace module through a Home Assistant static path.
- [x] Add or update its Lovelace resource without creating duplicates.
- [x] Port the authenticated artwork-cache WebSocket command from the prototype.
- [x] Enforce numeric App Store IDs, two-letter storefronts, PNG validation, the
      5 MB response limit and the 500-file cache limit.
- [x] Keep artwork writes atomic and safe under concurrent requests.
- [x] Add clean unload behavior where Home Assistant supports it.
- [x] Add English custom-integration translations under `translations/en.json`.

## Launcher card

- [x] Port the prototype to TypeScript and Lit.
- [x] Discover apps with `media_player/browse_media` and retain bundle IDs.
- [x] Fall back to the media player's `source_list` when browsing is unavailable.
- [x] Implement include/exclude filtering and pinned ordering by name or bundle ID.
- [x] Implement configurable desktop and mobile column bounds.
- [x] Add the Home Assistant visual card editor schema for common settings.
- [x] Preserve the wake, launch and single bounded retry behavior.
- [x] Add the Apple TV Remote-style power control.
- [x] Highlight the active app without rebuilding images on unrelated HA updates.
- [x] Port custom artwork overrides, built-in Apple artwork mappings, optional
      iTunes lookup, persistent HA caching and deterministic local fallbacks.
- [x] Preserve keyboard access, VoiceOver labels, touch behavior and reduced motion.
- [x] Add loading, empty, unavailable and bounded-error states.

## Tests and quality

### Apple TV support matrix

The card relies on Home Assistant's built-in Apple TV integration and its
Companion-protocol app list. Rows marked **Planned** still require validation
before they can be claimed as supported.

| Apple TV model                            | tvOS version                           | Status             | Validation needed                                         |
| ----------------------------------------- | -------------------------------------- | ------------------ | --------------------------------------------------------- |
| Apple TV HD (4th generation)              | Latest version available for the model | Planned            | Discovery, wake, launch, retry and power                  |
| Apple TV 4K (1st generation)              | Latest version available for the model | Planned            | Discovery, wake, launch, retry and power                  |
| Apple TV 4K (2nd generation)              | Latest version available for the model | Planned            | Discovery, wake, launch, retry and power                  |
| Apple TV 4K (3rd generation)              | tvOS 26.6                              | Prototype verified | Re-run the complete v0.1.0 test suite                     |
| Future Apple TV hardware or tvOS releases | Current release                        | Best effort        | Revalidate after Home Assistant or pyatv protocol changes |

- [ ] Record the exact Home Assistant and built-in Apple TV integration versions
      used for every completed support-matrix row.
- [ ] Confirm Companion pairing and app browsing work on every claimed model.
- [ ] Update the README support table from this matrix before each release.

- [x] Unit-test media-browser discovery and `source_list` fallback.
- [x] Unit-test filtering, ordering, column bounds and configuration validation.
- [x] Unit-test artwork overrides, privacy mode and URL generation.
- [x] Unit-test wake and launch success, one retry, and terminal failure.
- [x] Test accessible labels and real-button keyboard semantics.
- [x] Test artwork-cache validation, cache limits and atomic writes.
- [x] Test config-flow single-entry behavior and Lovelace resource registration.
- [x] Run `npm run check`, `ruff`, `pytest`, and local hassfest validation.
- [ ] Run the HACS action after the public GitHub description and topics exist.
- [ ] Inspect the built card at mobile, tablet and desktop sizes.
- [ ] Validate on at least two Apple TV generations and the current stable Home
      Assistant release before v0.1.0.

## Documentation and release

- [x] Replace the status-only README with HACS installation, Home Assistant setup,
      card configuration, artwork privacy and troubleshooting instructions.
- [x] Document that Apple TV app inventory refresh requires reloading the built-in
      Apple TV config entry.
- [ ] Add screenshots made only from distributable or mock content.
- [x] Document all YAML-only advanced settings and their defaults.
- [ ] Verify package and manifest versions match the release tag.
- [ ] Publish v0.1.0 and attach `apple_tv_launcher.zip`.
