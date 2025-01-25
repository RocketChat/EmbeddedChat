# @embeddedchat/react

## 0.2.2

### Patch Changes

- Version Bump
- Updated dependencies
  - @embeddedchat/ui-elements@0.1.2
  - @embeddedchat/markups@0.1.2
  - @embeddedchat/ui-kit@0.1.2
  - @embeddedchat/api@0.1.2

## 0.2.1

### Patch Changes

- Version Bump
- Updated dependencies
  - @embeddedchat/ui-elements@0.1.1
  - @embeddedchat/markups@0.1.1
  - @embeddedchat/ui-kit@0.1.1
  - @embeddedchat/api@0.1.1

## 0.2.0

### Minor Changes

- 5f604c59: - Separated components, markups, and ui-kit into individual monorepos.

  See [#604](https://github.com/RocketChat/EmbeddedChat/pull/604).

- 5f604c59: - Replaced all `Module.css` files with inline styles using Emotion CSS.

  - Fixed emoji alignment by removing a hotfix and applying an actual fix.
  - Removed the non-functional grid component and added a new grid component without `Module.css` files.
  - Refactored the `search` component into a sidebar.
  - Refactored the `Attachment` component to utilize the modal component, removing unnecessary code.
  - Replaced `<div>` and `<span>` with `<Box>` for consistency across components.
  - Added `styles.js` files for components with more than 2 lines of CSS.
  - Restructured the project by separating core components from views.
  - Fixed modal stylings.

  See [#576](https://github.com/RocketChat/EmbeddedChat/pull/576).

- 5f604c59: - Fixed emoji popup behavior when sidebar opens.

  - Cleaned up hardcoded colors, improved UI consistency with themes.
  - Fixed TOTP modal issues.
  - Fixed bounce effect when closing emoji popup.
  - Added customization options in ChatHeader, Message Toolbox, and Formatting Toolbar.
  - Designed bubble variant for UI consistency.
  - Refactored bubble styles for better alignment.
  - Fixed UI for quote and pinned message.

  See [#581](https://github.com/RocketChat/EmbeddedChat/pull/581).

- 5f604c59: - Reordered code for better readability.

  - Removed unnecessary global states, handled by ECOptions.
  - Cleaned up EmbeddedChat component, moved layout-related functions to ChatLayout.js.
  - Added AuthTokenEndpoint in RC-app for token management.
  - Modified auth.js to support both secure and localStorage login.
  - Added API calls in RocketChatAuth library.

  See [#590](https://github.com/RocketChat/EmbeddedChat/pull/590).

- 5f604c59: - Introduced 'layout-editor' for real-time drag-and-drop layout customization and theme generation in EmbeddedChat.

  See [#607](https://github.com/RocketChat/EmbeddedChat/pull/607).

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

- 5f604c59: - Refactored bubble styles to be independent.

  - Refactored sidebar with a common message aggregator to reduce repetition.
  - Positioned popup relative to the message.
  - Fixed display name prop issues.
  - Added popup option for sidebar menus, allowing flexible choice.
  - Added random color option for display names.

  See [#584](https://github.com/RocketChat/EmbeddedChat/pull/584).

- 5f604c59: - Configure EC remotely: added settings, refactored read logic, introduced fetch function, and added useRemoteProps hook to override props.

  See [#599](https://github.com/RocketChat/EmbeddedChat/pull/599).

- 5f604c59: - Shifted to ShadCN naming system.

  - Fixed theming system and various component stylings.
  - Limited modal size to EC component using React Portals.
  - Removed Dropbox
  - Fixed ImageGallery and UI inconsistencies.
  - Resolved Sidebar overlap issue.
  - Redesigned 'RocketChat - Minimalist' UI variant.
  - Fixed Popup, member list, and command list popup.
  - Fixed swiper bugs and stylings.
  - Removed unnecessary dependencies and matched colors.
  - Updated test to check .ec-chat-header--channelName instead of .ec-chat-header--channelDescription.

  See [#579](https://github.com/RocketChat/EmbeddedChat/pull/579).

- 5f604c59: - Fixed MemberList and CommandList stylings.

  - Added auto-scroll functionality to MentionList and CommandList menus.
  - Added keyboard control in CommandList menu.
  - Implemented word break in input component when text exceeds the limit.
  - Added scroll functionality in input.
  - Fixed Ctrl+B and Ctrl+I toggling, reused existing functionality.
  - Refactored code into separate functions and components based on concerns.

  See [#589](https://github.com/RocketChat/EmbeddedChat/pull/589).

### Patch Changes

- 5f604c59: - Optimized package size for bundling.

  See [#606](https://github.com/RocketChat/EmbeddedChat/pull/606).

- 5f604c59: - Restructured Auto Login, added loading screens, and cleaned up code.

  See [#594](https://github.com/RocketChat/EmbeddedChat/pull/594).

- c8c9dee0: Fix: Room members avatar invalid avatar url creation
- 100c5f79: Improve: Added confirmation modal on deleting message
- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
- Updated dependencies [5f604c59]
  - @embeddedchat/ui-elements@0.1.0
  - @embeddedchat/ui-kit@0.1.0
  - @embeddedchat/markups@0.1.0
  - @embeddedchat/api@0.1.0

## 0.1.12

### Patch Changes

- 14117c0: Fixed: invalid storing of authenticatedUserId

## 0.1.11

### Patch Changes

- ce5a26b: Improved: Message Editing feature

## 0.1.10

### Patch Changes

- 47e03ce: Fixed: Error on sending thread messages

## 0.1.9

### Patch Changes

- Fixed fullscreen styling

## 0.1.8

### Patch Changes

- Fixed: Implement Token Handling Utilities Compatible with SSR
  Fixed: Broken Behavior of Emoji picker in toolbar
  Fixed: Message reactions size
  Fixed: Remove unused menu options
  Fixed: Fixed fullscreen action button
- Updated dependencies
  - @embeddedchat/api@0.0.2

## 0.1.5

### Patch Changes

- support @embeddedchat/react for Server Side Rendering

## 0.1.0

### Minor Changes

- fixed issue: useInsertionEffect not found in 'react'
