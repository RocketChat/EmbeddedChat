# @embeddedchat/api

## 0.1.0

### Minor Changes

- 5f604c59: - Configure EC remotely: added settings, refactored read logic, introduced fetch function, and added useRemoteProps hook to override props.

  See [#599](https://github.com/RocketChat/EmbeddedChat/pull/599).

### Patch Changes

- 5f604c59: - Restructured Auto Login, added loading screens, and cleaned up code.

  See [#594](https://github.com/RocketChat/EmbeddedChat/pull/594).

- 5f604c59: - Modularized UiKit folder structure.

  - Added logic for state and view updates, similar to Rocket.Chat.
  - Implemented contexts and action handlers for modals and actions.
  - Added interactions for sending values to the server.
  - Introduced global states for modals and contextual bar.
  - Resolved menu issues and added contextual bar support.
  - Fixed stylings and addressed minor bugs.
  - Added support for static and multi-select elements with custom components.
  - Created stories for new components.

  See [#593](https://github.com/RocketChat/EmbeddedChat/pull/593).

- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
  - @embeddedchat/auth@0.1.0

## 0.0.2

### Patch Changes

- Fixed: Implement Token Handling Utilities Compatible with SSR
  Fixed: Broken Behavior of Emoji picker in toolbar
  Fixed: Message reactions size
  Fixed: Remove unused menu options
  Fixed: Fixed fullscreen action button
