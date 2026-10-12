# ChatGPT Emoji Titles

A Chrome and Edge extension that prefixes ChatGPT conversation titles with a random emoji. The two modes are independent:

- **Manual:** Open the extension popup and select **Select a chat →**, then click one chat in the ChatGPT sidebar. Press Esc to cancel.
- **Automatic:** Turn on **Rename visible chats**. The extension works through chats shown in the sidebar one at a time and processes new ones as they appear.

The extension remembers chats it has renamed in local extension storage. It runs only on `https://chatgpt.com/`. It does not use a ChatGPT API or send titles to another service.

## Install

1. Extract the ZIP, if needed.
2. In Chrome, open `chrome://extensions`; in Edge, open `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this folder.
5. Reload an open ChatGPT tab.

If you installed an earlier unpacked version, replace its files with this version, click the extension's **Reload** button on the extensions page, and reload ChatGPT. For a ZIP installation, extract the new ZIP and point **Load unpacked** at the extracted folder.

ChatGPT can change its page structure. Version 1.1 uses the conversation options control and inline **Chat title** editor documented in a [May 2026 live DOM inspection](https://github.com/Dworrall21/chatgpt-bridge/blob/main/dom-selectors.md). If ChatGPT changes these controls, the selectors in `content.js` may need updating. The extension pauses retries for a failed chat until the page is reloaded.

## Development checks

Run `npm install` and `npm test` to execute the manual and automatic rename regression tests.
