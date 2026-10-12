# Project state

## Architecture

- Manifest V3 browser extension for Chrome and Edge.
- `popup.html`, `popup.css`, `popup.js`: neo-brutalist control panel with manual add, automatic add, and automatic remove controls. Automatic switches are mutually exclusive.
- `content.js`: ChatGPT sidebar detection, selection mode, authenticated title update, mutation-driven automatic queue.
- `tests/rename.test.cjs` and `tests/popup.test.cjs`: DOM and popup regression tests.
- `chrome.storage.local`: automatic mode preferences only. Per-chat state is session-local so switching add/remove works; legacy `renamed_*` records are ignored.
- No external runtime dependencies. Network requests go only to ChatGPT's own signed-in endpoints.

## Decisions and constraints

- Version 1.2 uses `GET /api/auth/session` to read the signed-in access token and `PATCH /backend-api/conversation/{id}` with `{title}`. The token is cached only in content-script memory and is never logged or stored. ChatGPTBox and ChatGPT History Manager provide working examples of these internal web endpoints. No public stable API exists for this action.
- Version 1.3 reads a selection of user messages from `GET /backend-api/conversation/{id}` for local topic matching. It uses fixed keyword categories and a random fallback; there is no Groq request or API key.
- Automatic removal strips consecutive leading emoji grapheme clusters and their following whitespace, preserving the remaining title. It skips emoji-only titles.
- Automatic mode processes visible sidebar links with a delay to avoid simultaneous UI actions.
- A chat is marked completed in the current tab only after ChatGPT returns a successful title-update response. The local sidebar title is then updated without navigating or reloading.
- The earlier DOM-menu approach failed on the user's actual ChatGPT layout twice. Do not return to fixed conversation-menu selectors as the primary rename path.
- Visible link text is the primary title source; `aria-label` and `title` are fallbacks.
- Conversation IDs are extracted from both `/c/{id}` and project chat `/g/{project}/c/{id}` links on the same origin.
- Automatic scans are serialized to prevent overlapping title updates.
- The internal ChatGPT web endpoint may change. Failed chats are not retried until page reload.
- Permission scope is `chatgpt.com` plus extension storage.
- Private GitHub repository: `https://github.com/remriel/chatgpt-emoji-titles`.

## Relevant files

- `manifest.json`: browser permissions and content script registration.
- `content.js`: `rename`, `scan`, `relevantEmoji`, `withoutLeadingEmoji`, click capture and popup message handling.
- `popup.js`: mode control and communication with the active ChatGPT tab.

## Known limitations

- Only chats loaded into the current sidebar are eligible for automatic processing.
- Topic matching is rule based and may fall back to a random emoji when no category matches.
- ChatGPT may change its internal title update endpoint or session response.
- Live signed-in ChatGPT UI verification remains to be done; the available in-app browser session is signed out.

## RESUME HERE

Load version 1.3 unpacked in Chrome or Edge, test manual add, automatic add, and automatic remove on a signed-in ChatGPT account, and inspect the displayed HTTP status if an update fails. Six regression tests currently pass. Repackage and push any follow-up fix.
