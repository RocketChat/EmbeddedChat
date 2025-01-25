---
"@embeddedchat/react": minor
"@embeddedchat/auth": minor
"@embeddedchat/rc-app": minor
---

- Reordered code for better readability.
- Removed unnecessary global states, handled by ECOptions.
- Cleaned up EmbeddedChat component, moved layout-related functions to ChatLayout.js.
- Added AuthTokenEndpoint in RC-app for token management.
- Modified auth.js to support both secure and localStorage login.
- Added API calls in RocketChatAuth library.

See [#590](https://github.com/RocketChat/EmbeddedChat/pull/590).

