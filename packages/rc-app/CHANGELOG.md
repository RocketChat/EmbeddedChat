# @embeddedchat/rc-app

## 0.1.2

### Patch Changes

- Version Bump

## 0.1.1

### Patch Changes

- Version Bump

## 0.1.0

### Minor Changes

- 5f604c59: - Reordered code for better readability.

  - Removed unnecessary global states, handled by ECOptions.
  - Cleaned up EmbeddedChat component, moved layout-related functions to ChatLayout.js.
  - Added AuthTokenEndpoint in RC-app for token management.
  - Modified auth.js to support both secure and localStorage login.
  - Added API calls in RocketChatAuth library.

  See [#590](https://github.com/RocketChat/EmbeddedChat/pull/590).

- 5f604c59: - Configure EC remotely: added settings, refactored read logic, introduced fetch function, and added useRemoteProps hook to override props.

  See [#599](https://github.com/RocketChat/EmbeddedChat/pull/599).

### Patch Changes

- 5f604c59: - Added regex check for valid CSS dimensions and used onPreSettingUpdate to reject invalid updates.

  See [#601](https://github.com/RocketChat/EmbeddedChat/pull/601).

- 5f604c59: - Introduced 'layout-editor' for real-time drag-and-drop layout customization and theme generation in EmbeddedChat.

  See [#607](https://github.com/RocketChat/EmbeddedChat/pull/607).
