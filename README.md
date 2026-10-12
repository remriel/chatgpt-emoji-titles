# ChatGPT Emoji Titles

A Chrome and Edge extension that prefixes ChatGPT conversation titles with a random emoji. The two modes are independent:

- **Manual:** Open the extension popup and select **Select a chat →**, then click one chat in the ChatGPT sidebar. Press Esc to cancel.
- **Automatic:** Turn on **Rename visible chats**. The extension works through chats shown in the sidebar one at a time and processes new ones as they appear.

The extension remembers chats it has renamed in local extension storage. It runs only on `https://chatgpt.com/`. It uses ChatGPT's signed-in web endpoint to save a title, then updates the visible sidebar title. It fetches your ChatGPT session token for authorization, keeps it in memory only, and sends it only to `chatgpt.com`. It never sends titles or tokens to another service.

## Install

1. Extract the ZIP, if needed.
2. In Chrome, open `chrome://extensions`; in Edge, open `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this folder.
5. Reload an open ChatGPT tab.

If you installed an earlier unpacked version, replace its files with this version, click the extension's **Reload** button on the extensions page, and reload ChatGPT. For a ZIP installation, extract the new ZIP and point **Load unpacked** at the extracted folder.

Version 1.2 no longer depends on ChatGPT's changing conversation menu. It uses the title update request documented by [ChatGPTBox's web API client](https://github.com/ChatGPTBox-dev/chatGPTBox/blob/master/src/services/apis/chatgpt-web.mjs) and the session approach used by a [ChatGPT history browser extension](https://github.com/aykutkardas/ChatGPT-History-Manager). This is an internal ChatGPT web endpoint, so ChatGPT can change it. If a request fails, the extension shows its HTTP status and pauses retries for that chat until the page is reloaded.

## Development checks

Run `npm install` and `npm test` to execute the manual and automatic rename regression tests.
