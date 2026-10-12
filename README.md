# ChatGPT Emoji Titles

A Chrome and Edge extension that adds a relevant emoji to ChatGPT conversation titles, with a separate option to remove leading emoji:

- **Manual add:** Open the extension popup and select **Select a chat →**, then click one chat in the ChatGPT sidebar. Press Esc to cancel.
- **Automatic add:** Turn on **Add relevant emoji**. The extension works through chats shown in the sidebar one at a time and processes new ones as they appear.
- **Automatic remove:** Turn on **Remove leading emoji**. The extension removes emoji from the start of visible chat titles and keeps the rest of each title. An emoji-only title is left alone to avoid an empty title.

The two automatic switches are mutually exclusive. Starting manual add while automatic remove is on turns removal off, so it cannot immediately undo the manual change.

Emoji choice uses a small local topic matcher. It reads the chat title and a limited selection of user messages from the conversation through ChatGPT's own endpoint. If no topic matches, it picks a random emoji. **No Groq key or third-party AI service is needed.**

The extension runs only on `https://chatgpt.com/`. It uses ChatGPT's signed-in web endpoint to save titles. It fetches your ChatGPT session token for authorization, keeps it in memory only, and sends it only to `chatgpt.com`. Conversation text is processed locally in the extension; it is not sent to Groq or another service. Extension storage contains only the two automatic mode preferences.

## Install

1. Extract the ZIP, if needed.
2. In Chrome, open `chrome://extensions`; in Edge, open `edge://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this folder.
5. Reload an open ChatGPT tab.

If you installed an earlier unpacked version, replace its files with this version, click the extension's **Reload** button on the extensions page, and reload ChatGPT. For a ZIP installation, extract the new ZIP and point **Load unpacked** at the extracted folder.

The extension does not depend on ChatGPT's changing conversation menu. It uses the title update request documented by [ChatGPTBox's web API client](https://github.com/ChatGPTBox-dev/chatGPTBox/blob/master/src/services/apis/chatgpt-web.mjs) and the session approach used by a [ChatGPT history browser extension](https://github.com/aykutkardas/ChatGPT-History-Manager). This is an internal ChatGPT web endpoint, so ChatGPT can change it. If a request fails, the extension shows its HTTP status and pauses retries for that chat until the page is reloaded.

## Development checks

Run `npm install` and `npm test` to execute the manual add, automatic add, automatic remove, and popup mode regression tests.
