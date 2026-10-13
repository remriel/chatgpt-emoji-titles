# Project state

## Purpose

Chat Emoji Titles is a Manifest V3 extension for Chrome and Edge that adds or removes leading emoji in ChatGPT conversation titles.

## Architecture

- `manifest.json`: extension permissions, popup and content-script registration.
- `popup.html`, `popup.css`, `popup.js`: manual selection controls and mutually exclusive automatic switches.
- `content.js`: sidebar link detection, local topic matching, title requests and automatic processing queue.
- `assets/icons/`: icon PNGs referenced by the manifest.
- `tests/`: DOM and popup regression tests.
- `PRIVACY.md`: explanation of the extension's browser data access.
- `.github/workflows/extension-release.yml`: prepares one release archive containing only files needed by the extension.

## Behaviors and constraints

- The extension gets signed-in authorization with `GET /api/auth/session` and updates a title with `PATCH /backend-api/conversation/{id}`.
- It may read selected conversation messages through ChatGPT's own endpoint to determine a relevant emoji locally. No external service is involved.
- Manual removal strips consecutive leading emoji and their whitespace, preserving title text, and skips emoji-only titles.
- Automatic add/remove modes cannot both be active. A conflicting manual action switches off the opposing automatic mode.
- Scans are serialized; chats are marked complete in the current tab only after a successful title update.
- Conversation IDs can come from `/c/{id}` and `/g/{project}/c/{id}` paths.
- Permissions are limited to `storage` and `https://chatgpt.com/*`.
- Session authorization stays in tab memory; persistent extension storage keeps only automatic-mode preferences.
- The title endpoints are internal and could change. Failed chats are paused until reload.

## Status

Version 1.5.0 is in the manifest. The user confirmed the working extension in a signed-in ChatGPT browser on October 13, 2026. Tests previously passed.

The v1.5.0 release is intended to offer **one extension ZIP**, `chat-emoji-titles-v1.5.0.zip`. The release workflow rebuilds the archive and replaces other assets. Check its GitHub Actions run and the release assets to verify completion.

## Next maintenance

When ChatGPT changes its sidebar or internal endpoints, reproduce the issue, modify the runtime code, run `npm test` and syntax checks, then publish an updated extension archive.
