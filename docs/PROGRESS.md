# Progress

## Objective

Prepare and market the extension publicly for later Chrome Web Store and Microsoft Edge Add-ons publication by the user.

## Checklist

- [x] Create Manifest V3 extension and popup controls.
- [x] Implement manual chat selection and automatic visible-chat queue.
- [x] Add session completion tracking and save confirmation.
- [x] Check JavaScript syntax.
- [x] Create and push private GitHub repository.
- [x] Fix the reported menu and title selector failures.
- [x] Add regression tests for manual and automatic modes.
- [x] Replace the repeatedly failing menu path with ChatGPT's signed-in title endpoint.
- [x] Test that server rejection leaves the chat unchanged.
- [x] Add automatic leading-emoji removal and mutually exclusive automatic switches.
- [x] Add local relevance matching from title and conversation text without Groq.
- [x] Add single-chat manual removal with a separate select button.
- [x] Prevent opposing automatic mode from undoing a manual action.
- [x] Verify extension functionality against a signed-in ChatGPT page (user confirmed it works).
- [x] Publish GitHub release v1.4.0 with the ZIP asset.
- [x] Change repository visibility from private to public at the user's request and set public description/topics.
- [x] Generate and integrate production icon assets.
- [x] Prepare store promotional tile and actual-popup screenshots at required sizes.
- [x] Draft Chrome and Edge listing copy, privacy policies, and launch copy.
- [x] Build a runtime-only store ZIP and separate marketing asset ZIP.
- [x] Run final tests and package validation.
- [x] Push public-facing repository updates and publish v1.5 release assets.

Progress: **100% — store submission kit built and publicly released**.

## Current state

Version 1.5.0 is published on GitHub with two ZIP assets. The user will publish on extension stores; no store submission has been made by Codex.

## Tests and verification

- `node --check content.js` passed.
- `node --check popup.js` passed.
- Initial source pushed to private GitHub repository.
- `npm test` passes eight regression tests, including single-chat manual removal and a no-emoji no-op.
- Available ChatGPT browser session was inspected but is signed out, so it has no chat sidebar to test live.
- The user confirmed on October 13, 2026 that the extension works perfectly in their browser.
- GitHub release asset digest matches the local ZIP SHA-256: `e781a4fb6f917afa8c472df29ef7c2f7487996f49afb2c445c62bdda66ac4576`.
- GitHub repository visibility was changed to public at the user's request.
- Store package SHA-256: `c785ab406271f7f0a3eb8cfd50681fc05533629e03dfe83b582e7e5c66460b74`.
- Marketing kit SHA-256: `261f9ecf62a1c4730d36576f548e3d2da86c4d1097ce4344752775c192eefb65`.
- Public GitHub release creation returned `https://github.com/remriel/chatgpt-emoji-titles/releases/tag/v1.5.0`.

## Blockers

- Chrome and Edge dashboard publication will be done by the user after receiving the kit.

## Exact next steps

1. The user uploads the store ZIP and separate images/copy from the marketing kit in the Chrome Web Store and Microsoft Edge Add-ons dashboards.
2. After store approval, add the live store links to the README and launch copy.
3. If a store reviewer reports a blocking issue, fix that issue and publish a new version.
