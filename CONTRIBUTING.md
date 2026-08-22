# Contributing

Install the frontend dependencies with `npm ci`, then use `npm run check` for
the TypeScript card. Install `requirements_test.txt` and run `pytest` plus
`ruff check custom_components tests/backend` for the Home Assistant component.

The built card at
`custom_components/apple_tv_launcher/frontend/apple-tv-launcher-card.js` is a
release artifact and must be committed whenever frontend source changes.
