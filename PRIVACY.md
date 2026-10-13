# Privacy policy for Chat Emoji Titles

Effective date: October 13, 2026

Chat Emoji Titles is an independent browser extension for changing the titles of conversations in a signed-in ChatGPT account. It is not affiliated with or endorsed by OpenAI.

## Information the extension accesses

When you use an add or remove action, the extension reads conversation links and titles shown in the ChatGPT sidebar. To choose a topic-relevant emoji, it may request a conversation from ChatGPT and examine selected user messages in that conversation. It also requests the access token for your existing ChatGPT session so it can send an authorized title update to ChatGPT.

The extension reads this information only on `https://chatgpt.com/`. The token and conversation text are held in the browser tab's memory while needed. They are not written to extension storage, included in diagnostics, or sent to the developer.

## How information is used and shared

Title and message text are used locally to choose an emoji or remove leading emoji. The extension sends title changes, with your session authorization, only to ChatGPT's own `chatgpt.com` web endpoints. It does not send conversation text or tokens to Groq, advertising networks, analytics services, or developer-operated servers. It does not sell user data or use it for advertising. No developer or other person can read conversation content through the extension.

ChatGPT itself processes requests under its own terms and privacy policy. The extension relies on ChatGPT's internal web endpoints, which may change.

## Local storage and retention

The extension stores only the on/off settings for automatic emoji adding and automatic emoji removal in `chrome.storage.local`. These preferences remain until you change them, clear extension data, or uninstall the extension. Older versions may have left per-chat completion records in extension storage; version 1.5 does not read or create those records. You can remove them by clearing the extension's storage or uninstalling it.

Session tokens, conversation text, and per-tab processing state are not retained after the ChatGPT tab closes or reloads. The extension does not maintain an account or a developer-side database.

## Your controls

Both automatic modes can be switched off in the popup. You can remove the extension or clear its data in Chrome or Edge. You can also change chat titles directly in ChatGPT.

## Permissions

- `chatgpt.com` host access: read sidebar chat links and titles, request conversation text for local emoji matching, and save title changes through ChatGPT.
- `storage`: remember the two automatic mode preferences.

## Limited use

Use of information received through browser permissions is limited to the extension's user-facing purpose of adding or removing emoji from ChatGPT titles. The extension does not transfer that information for advertising, sale, or unrelated purposes, and does not allow humans to read it.

## Contact and updates

For questions or privacy requests, open an issue at [the project's GitHub Issues page](https://github.com/remriel/chatgpt-emoji-titles/issues). Material changes to this policy will be published in this repository before or alongside an extension update.
