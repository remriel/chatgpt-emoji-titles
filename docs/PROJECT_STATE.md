# Project state

## Architecture

- Manifest V3 browser extension for Chrome and Edge.
- `popup.html`, `popup.css`, `popup.js`: neo-brutalist control panel with separate manual and automatic controls.
- `content.js`: ChatGPT sidebar detection, selection mode, UI-based title rename, mutation-driven automatic queue.
- `chrome.storage.local`: automatic mode preference and per-conversation completion record.
- No external runtime dependencies or network calls.

## Decisions and constraints

- Uses the ChatGPT web UI to rename chats because there is no stable public API for this action.
- Automatic mode processes visible sidebar links with a delay to avoid simultaneous UI actions.
- A chat is stored as completed only after the updated title appears in the sidebar.
- ChatGPT DOM changes may require selector updates. Failed chats are not retried until page reload.
- Permission scope is `chatgpt.com` plus extension storage.

## Relevant files

- `manifest.json`: browser permissions and content script registration.
- `content.js`: `rename`, `scan`, click capture and popup message handling.
- `popup.js`: mode control and communication with the active ChatGPT tab.

## Known limitations

- Only chats loaded into the current sidebar are eligible for automatic processing.
- ChatGPT interface changes may break menu or editor discovery.
- Live signed-in ChatGPT UI verification remains to be done.

## RESUME HERE

Load the unpacked extension in Chrome or Edge, test both modes on a signed-in ChatGPT account, and adjust `content.js` selectors or save interaction if the current UI differs. Then update these docs and package a new release.
