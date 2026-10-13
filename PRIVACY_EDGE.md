# Privacy policy for Chat Emoji Titles on Microsoft Edge

Effective date: October 13, 2026

Chat Emoji Titles is an independent Microsoft Edge extension for changing titles in a signed-in ChatGPT account. It is not affiliated with or endorsed by OpenAI or Microsoft.

## Information accessed

When you use an add or remove action, the extension reads ChatGPT sidebar conversation links and titles. For topic-relevant emoji, it may request a conversation from ChatGPT and examine selected user messages locally. It also requests the authorization token for your existing ChatGPT session to save title changes. The token and conversation text are kept only in the Edge tab's memory while needed. They are not sent to the developer.

## Use and sharing

The extension uses titles and selected message text only to add or remove a leading emoji. It sends the new title and your session authorization only to ChatGPT's `chatgpt.com` endpoints. It does not send conversation text or tokens to Groq, analytics, advertising networks, or developer-operated servers. It does not sell data, use data for ads, or allow human review of conversation content through the extension. ChatGPT handles its own requests under its terms and privacy policy.

## Storage and retention

The extension stores only the two automatic mode preferences in Edge's local extension storage. These persist until changed, cleared, or the extension is uninstalled. Older versions may have left per-chat completion records in extension storage; version 1.5 does not read or create those records. Clearing the extension's data or uninstalling it removes them. Session tokens, conversation text, and in-tab processing state are not retained after the ChatGPT tab closes or reloads. There is no developer-side account or database.

## Your controls

Both automatic modes can be turned off in the extension popup. You can remove the extension or clear its storage in Microsoft Edge. You can also edit chat titles directly in ChatGPT.

## Permissions

- `chatgpt.com` host access: read sidebar titles, request selected conversation text for local topic matching, and save title changes through ChatGPT.
- `storage`: keep the two automatic mode preferences.

## Limited use and contact

Information accessed through browser permissions is used only to provide the extension's title customization feature. It is not transferred for unrelated purposes. For questions or privacy requests, open an issue at [the project's GitHub Issues page](https://github.com/remriel/chatgpt-emoji-titles/issues). Material changes will be published in the repository before or alongside an update.
