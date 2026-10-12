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

ChatGPT can change its page structure. If the extension reports that it cannot find a chat menu, rename option, or title editor, the selectors in `content.js` may need updating. The extension pauses retries for that chat until the page is reloaded.
