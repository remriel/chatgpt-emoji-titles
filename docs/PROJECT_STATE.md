# Project state

## Architecture

- Manifest V3 browser extension for Chrome and Edge.
- `popup.html`, `popup.css`, `popup.js`: neo-brutalist control panel with separate manual and automatic controls.
- `content.js`: ChatGPT sidebar detection, selection mode, UI-based title rename, mutation-driven automatic queue.
- `tests/rename.test.cjs`: DOM regression tests for both modes.
- `chrome.storage.local`: automatic mode preference and per-conversation completion record.
- No external runtime dependencies or network calls.

## Decisions and constraints

- Uses the ChatGPT web UI to rename chats because there is no stable public API for this action.
- Automatic mode processes visible sidebar links with a delay to avoid simultaneous UI actions.
- A chat is stored as completed only after the updated title appears in the sidebar.
- Version 1.1 uses the dedicated `history-item-N-options` button, the `Rename` menu item, and `input[aria-label="Chat title"]`, based on a May 2026 live DOM inspection at `https://github.com/Dworrall21/chatgpt-bridge/blob/main/dom-selectors.md`.
- `aria-label` is the primary title source; the previous implementation relied on a broad row button guess and strict menu text, which caused failed renames.
- Automatic scans are serialized to prevent overlapping menu interactions.
- ChatGPT DOM changes may require selector updates. Failed chats are not retried until page reload.
- Permission scope is `chatgpt.com` plus extension storage.
- Private GitHub repository: `https://github.com/remriel/chatgpt-emoji-titles`.

## Relevant files

- `manifest.json`: browser permissions and content script registration.
- `content.js`: `rename`, `scan`, click capture and popup message handling.
- `popup.js`: mode control and communication with the active ChatGPT tab.

## Known limitations

- Only chats loaded into the current sidebar are eligible for automatic processing.
- ChatGPT interface changes may break menu or editor discovery.
- Live signed-in ChatGPT UI verification remains to be done; the available in-app browser session is signed out.

## RESUME HERE

Load version 1.1 unpacked in Chrome or Edge, test both modes on a signed-in ChatGPT account, and adjust `content.js` if the current UI differs. The DOM regression tests currently pass. Repackage and push any follow-up fix.
