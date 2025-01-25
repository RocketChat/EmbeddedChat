---
"@embeddedchat/react": minor
---

- Replaced all `Module.css` files with inline styles using Emotion CSS.
- Fixed emoji alignment by removing a hotfix and applying an actual fix.
- Removed the non-functional grid component and added a new grid component without `Module.css` files.
- Refactored the `search` component into a sidebar.
- Refactored the `Attachment` component to utilize the modal component, removing unnecessary code.
- Replaced `<div>` and `<span>` with `<Box>` for consistency across components.
- Added `styles.js` files for components with more than 2 lines of CSS.
- Restructured the project by separating core components from views.
- Fixed modal stylings.

See [#576](https://github.com/RocketChat/EmbeddedChat/pull/576).
