# Project state

## Architecture

- Manifest V3 browser extension for Chrome and Edge.
- `popup.html`, `popup.css`, `popup.js`: neo-brutalist control panel with separate manual and automatic controls.
- `content.js`: ChatGPT sidebar detection, selection mode, authenticated title update, mutation-driven automatic queue.
- `tests/rename.test.cjs`: DOM regression tests for both modes.
- `chrome.storage.local`: automatic mode preference and per-conversation completion record.
- No external runtime dependencies or network calls.

## Decisions and constraints

- Version 1.2 uses `GET /api/auth/session` to read the signed-in access token and `PATCH /backend-api/conversation/{id}` with `{title}`. The token is cached only in content-script memory and is never logged or stored. ChatGPTBox and ChatGPT History Manager provide working examples of these internal web endpoints. No public stable API exists for this action.
- Automatic mode processes visible sidebar links with a delay to avoid simultaneous UI actions.
- A chat is stored as completed only after ChatGPT returns a successful title-update response. The local sidebar title is then updated without navigating or reloading.
- The earlier DOM-menu approach failed on the user's actual ChatGPT layout twice. Do not return to fixed conversation-menu selectors as the primary rename path.
- Visible link text is the primary title source; `aria-label` and `title` are fallbacks.
- Conversation IDs are extracted from both `/c/{id}` and project chat `/g/{project}/c/{id}` links on the same origin.
- Automatic scans are serialized to prevent overlapping menu interactions.
- The internal ChatGPT web endpoint may change. Failed chats are not retried until page reload.
- Permission scope is `chatgpt.com` plus extension storage.
- Private GitHub repository: `https://github.com/remriel/chatgpt-emoji-titles`.

## Relevant files

- `manifest.json`: browser permissions and content script registration.
- `content.js`: `rename`, `scan`, click capture and popup message handling.
- `popup.js`: mode control and communication with the active ChatGPT tab.

## Known limitations

- Only chats loaded into the current sidebar are eligible for automatic processing.
- ChatGPT may change its internal title update endpoint or session response.
- Live signed-in ChatGPT UI verification remains to be done; the available in-app browser session is signed out.

## RESUME HERE

Load version 1.2 unpacked in Chrome or Edge, test both modes on a signed-in ChatGPT account, and inspect the displayed HTTP status if either fails. The request and local-title regression tests currently pass. Repackage and push any follow-up fix.
