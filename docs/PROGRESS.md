# Progress

## Goal

Maintain a working Chrome and Edge browser extension that adds or removes emoji at the beginning of ChatGPT conversation titles. Publish one downloadable extension archive per release.

## Completed

- Manifest V3 extension with manual add/remove and mutually exclusive automatic add/remove controls.
- ChatGPT title updates through the signed-in endpoint.
- Local topic-based emoji matching without a third-party AI service.
- Production extension icons.
- Eight regression tests and JavaScript syntax checks.
- Signed-in functional confirmation by the user on October 13, 2026.
- Public repository and tagged releases.
- Extension-only release packaging workflow.

## Release format

Each release contains a single ZIP, `chat-emoji-titles-v<version>.zip`, with `manifest.json`, `content.js`, `popup.html`, `popup.css`, `popup.js`, and the icon PNGs in `assets/icons/`. Nothing else is required for installation.

The workflow in `.github/workflows/extension-release.yml` packages these files, uploads the ZIP and removes other assets from the v1.5.0 release. It may be rerun manually if needed.

## Verification

- `npm test`: eight regression tests previously passed.
- `node --check content.js` and `node --check popup.js`: previously passed.
- User confirmed the extension worked in a signed-in browser on October 13, 2026.
- ChatGPT's internal endpoints may change and require later maintenance.
