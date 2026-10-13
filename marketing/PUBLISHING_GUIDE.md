# Publish Chat Emoji Titles in extension stores

This kit prepares version 1.5.0 for submission. It does not submit or publish on your behalf.

## Package and listing assets

Upload `chat-emoji-renamer-store-v1.5.0.zip` as the extension package. Its root contains `manifest.json`, the popup and content script, and four icon PNGs. Use `chat-emoji-renamer-marketing-v1.5.0.zip` only as a convenient bundle of store listing text, privacy policies, logo, tile, and screenshots; do not upload that ZIP as the extension.

The product name is **Chat Emoji Titles**. State that it works with ChatGPT in the description, and use the independent-project disclaimer. Do not describe it as an official OpenAI extension or as Groq-powered. See [OpenAI's brand guidelines](https://openai.com/brand/) for use of the ChatGPT mark.

## Chrome Web Store

1. Upload the store ZIP in the Chrome Web Store Developer Dashboard.
2. Use the Chrome description in `marketing/STORE_LISTING.md`.
3. Provide the 128×128 icon from `assets/icons/icon-128.png`, the 440×280 promotional tile, and at least one 1280×800 screenshot from `marketing/store/`.
4. Set the privacy policy URL to `https://github.com/remriel/chatgpt-emoji-titles/blob/master/PRIVACY.md`.
5. In the privacy practices fields, describe the single purpose and data handling using the reviewer notes in `marketing/STORE_LISTING.md`. The extension reads conversation titles, selected user messages, and an existing ChatGPT session token in browser memory; it saves title changes to ChatGPT and stores only automatic-mode preferences locally.
6. Review the generated listing, permissions, and images before submitting it for review.

Official references: [Chrome listing information](https://developer.chrome.com/docs/webstore/cws-dashboard-listing/), [Chrome image specifications](https://developer.chrome.com/docs/webstore/images/), [Chrome privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/), and [Chrome user data policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq/).

## Microsoft Edge Add-ons

1. Upload the same store ZIP in Microsoft Partner Center for Edge extensions.
2. Use the Edge description in `marketing/STORE_LISTING.md`. It exceeds the documented 250-character minimum.
3. Upload `marketing/store/logo-300.png` as the extension logo and `marketing/store/promo-small-440x280.png` as the small tile. The two 1280×800 screenshots are available if you choose to add screenshots.
4. Set the Edge privacy policy URL to `https://github.com/remriel/chatgpt-emoji-titles/blob/master/PRIVACY_EDGE.md`.
5. Add the suggested search terms, review the permissions and privacy answers, and submit for certification.

Official references: [Publish a Microsoft Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension) and [Edge extension developer policies](https://learn.microsoft.com/legal/microsoft-edge/extensions/developer-policies).

## After approval

Replace the placeholder links in `marketing/ANNOUNCEMENTS.md` with the approved store URLs. Add the Chrome and Edge store links to the GitHub README. Then share the public launch post from your preferred account.
