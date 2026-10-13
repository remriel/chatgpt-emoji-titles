# Progress

## Objective

Deliver a Chrome and Edge extension that adds topic-relevant emoji or removes leading emoji through separate manual and automatic controls, preserving title text on removal.

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
- [ ] Verify all four actions against a signed-in ChatGPT page.

Progress: **85% toward a verified, publishable result**.

## Current state

Version 1.4 source is complete and can be loaded unpacked. Browser live verification is outstanding.

## Tests and verification

- `node --check content.js` passed.
- `node --check popup.js` passed.
- Initial source pushed to private GitHub repository.
- `npm test` passes eight regression tests, including single-chat manual removal and a no-emoji no-op.
- Available ChatGPT browser session was inspected but is signed out, so it has no chat sidebar to test live.

## Blockers

- Signed-in ChatGPT page access is needed for end-to-end UI testing.

## Exact next steps

1. Load extension unpacked in Chrome or Edge and reload ChatGPT.
2. Test manual add and manual remove on individual chats.
3. Test automatic add, then automatic remove on visible sidebar chats; verify title text is unchanged.
4. If the request fails, use the displayed HTTP status to update authentication or endpoint handling.
5. Repackage and mark verified.
