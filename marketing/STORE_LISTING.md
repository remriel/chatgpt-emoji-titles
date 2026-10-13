# Store listing kit — version 1.5.0

Use the files in [`marketing/store`](store/) for Chrome Web Store and Microsoft Edge Add-ons. The extension package is `chat-emoji-renamer-store-v1.5.0.zip` in the project outputs folder. The package contains only runtime files and icons.

## Product details

**Name:** Chat Emoji Titles  
**Category:** Productivity  
**Language:** English  
**Website:** https://github.com/remriel/chatgpt-emoji-titles  
**Support:** https://github.com/remriel/chatgpt-emoji-titles/issues  
**Chrome privacy policy:** https://github.com/remriel/chatgpt-emoji-titles/blob/master/PRIVACY.md  
**Edge privacy policy:** https://github.com/remriel/chatgpt-emoji-titles/blob/master/PRIVACY_EDGE.md

**Short description (manifest and store):** Add or remove emoji from ChatGPT chat titles, one at a time or automatically.

## Chrome Web Store description

Find the chat you need faster with an expressive emoji at the start of its title. Chat Emoji Titles lets you add a topic-relevant emoji to one conversation, remove a leading emoji from one conversation, or apply either action automatically to chats visible in the ChatGPT sidebar.

Choose **Select to add emoji** or **Select to remove emoji**, then click a chat in the sidebar. For ongoing organization, turn on automatic adding or automatic removal. The two automatic modes are separate and mutually exclusive. Removing emoji leaves the rest of the title intact.

Emoji suggestions use a small local topic matcher. It considers the title and selected user messages from that conversation, then falls back to a random emoji if no topic matches. No Groq key or third-party AI service is required.

The extension runs only on `chatgpt.com`. It uses your existing ChatGPT session to save title changes. Conversation text and the session token stay in browser memory and are not sent to the developer, analytics services, or advertisers. Only the automatic mode preferences are stored locally. See the privacy policy for details.

This is an independent extension and is not affiliated with or endorsed by OpenAI. A signed-in ChatGPT account is required. ChatGPT's internal web interface can change, which may affect the extension until an update is released.

## Microsoft Edge Add-ons description

Make your ChatGPT conversations easier to spot. Chat Emoji Titles adds a relevant emoji to the start of a chat title, or removes leading emoji while preserving the rest of the title. You can select and change one chat at a time, or turn on an automatic mode for chats visible in the sidebar.

The automatic add and remove switches are separate and mutually exclusive. Manual actions turn off the opposing automatic mode so your choice is not immediately undone. Emoji suggestions use a local topic matcher based on the title and selected user messages, with a random fallback when no topic matches. No external AI key is required.

The extension works only on `chatgpt.com` and requires a signed-in ChatGPT account. It uses the existing ChatGPT session to save title changes. Conversation text and authorization stay in browser memory and are not sent to the developer or advertising services. Only automatic mode preferences are stored locally. See the linked privacy policy for details.

This independent extension is not affiliated with or endorsed by OpenAI. ChatGPT's internal web interface can change, which may require an extension update.

**Suggested Edge search terms:** ChatGPT titles; chat emoji; conversation organizer; emoji titles; ChatGPT sidebar

## Store media

| Asset | File | Size |
|---|---|---:|
| Extension icon | `assets/icons/icon-128.png` | 128 × 128 |
| Edge listing logo | `marketing/store/logo-300.png` | 300 × 300 |
| Small promotional tile | `marketing/store/promo-small-440x280.png` | 440 × 280 |
| Manual controls screenshot | `marketing/store/screenshot-manual-1280x800.png` | 1280 × 800 |
| Automatic controls screenshot | `marketing/store/screenshot-automatic-1280x800.png` | 1280 × 800 |

The screenshots use a captured image of the actual extension popup with labeled examples. They do not show private chats.

## Privacy practices / reviewer notes

**Single purpose:** Add or remove leading emoji on ChatGPT conversation titles, manually or automatically.

**Why `chatgpt.com` access is needed:** Read chat links and titles, inspect selected user messages locally to choose an emoji, and save the requested title changes through the signed-in ChatGPT session.

**Why `storage` is needed:** Save the automatic add and automatic remove on/off preferences locally.

**Data handling to disclose:** The extension accesses ChatGPT conversation titles, selected user message text, and the existing session token. It does not send these to developer-operated servers or third-party AI services. Title updates go to ChatGPT. The token is kept only in tab memory; preferences are stored locally.

**No claims to make:** Do not say the extension is official, AI-powered by Groq, or compatible with sites beyond `chatgpt.com`.

## Submission sequence

1. Upload the store ZIP to the Chrome Web Store and Microsoft Edge Add-ons dashboards.
2. Upload the icon/logo, promotional tile, and screenshots from the paths above.
3. Paste the matching description for each store and enter its privacy policy URL above.
4. Complete each store's privacy questionnaire consistently with the data handling notes above.
5. Review the live listing and publish from your own developer account.
