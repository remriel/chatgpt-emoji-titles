# Chat Emoji Titles

![Chat Emoji Titles extension icon](assets/icons/icon-128.png)

Add a topic-relevant emoji to ChatGPT conversation titles, or remove leading emoji without changing the title text. Works in Chrome and Edge.

**[Download the browser extension](https://github.com/remriel/chatgpt-emoji-titles/releases/latest)** · [Privacy](PRIVACY.md) · [Report an issue](https://github.com/remriel/chatgpt-emoji-titles/issues)

## Features

- **Manual add:** Click **Select to add emoji →** in the extension popup, then choose a conversation in the ChatGPT sidebar. Press Esc to cancel.
- **Manual remove:** Click **Select to remove emoji →**, then choose a conversation to remove its leading emoji.
- **Automatic add:** Enable **Add relevant emoji** to update conversations visible in the sidebar as they appear.
- **Automatic remove:** Enable **Remove leading emoji** to clear leading emoji from visible conversations. Emoji-only titles remain unchanged.

The automatic modes are mutually exclusive. Manual actions disable an opposing automatic mode so it cannot immediately reverse your choice.

Emoji selection uses a local, keyword-based topic matcher over the title and a limited selection of user messages. When there is no topic match, it uses a random emoji. No external AI key or service is required.

## Install

1. Download `chat-emoji-titles-v1.5.0.zip` from the [latest release](https://github.com/remriel/chatgpt-emoji-titles/releases/latest) and extract it.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the extracted folder containing `manifest.json`.
5. Reload any open ChatGPT tabs.

For updates, replace the extracted files, click **Reload** for the extension on the browser extensions page, and reload ChatGPT. You can also clone this repository and use its root directory with **Load unpacked**.

## Privacy and compatibility

The extension runs on `https://chatgpt.com/`. It retrieves your existing ChatGPT session authorization in memory to save title changes through ChatGPT's own web endpoints. It processes conversation text locally and retains only automatic-mode preferences in extension storage. Read [PRIVACY.md](PRIVACY.md) for details.

The extension relies on internal ChatGPT endpoints that may change. If a title update fails, it displays the HTTP error and pauses further retries for that conversation until the page reloads.

This is an independent extension and is not affiliated with or endorsed by OpenAI.

## Development

Run `npm install` and `npm test` to execute the regression tests. Use `node --check content.js` and `node --check popup.js` for JavaScript syntax checks.

A GitHub Actions workflow packages the six runtime files and extension icons into one release ZIP. It excludes tests, docs and development files.
