# Pull Request Summary

## 🎯 Issues Addressed

### Issue #1149: Search API does not URL-encode searchText query parameter

**Status:** ✅ Fixed

**Problem:**
The search API request did not URL-encode user-provided `searchText` before appending it to query params. Special characters like `&`, `?`, `#`, `%` could break or alter query parsing.

**Solution:**

- Added `encodeURIComponent(text)` to properly encode user input in `packages/api/src/EmbeddedChatApi.ts` (line 1114)
- Ensures all user input is treated as data, not query syntax
- Prevents query parameter corruption

**Files Changed:**

- `packages/api/src/EmbeddedChatApi.ts`

**Commit:** `aaeb3c2a` - fix: URL-encode searchText parameter in getSearchMessages API

---

## 🏗️ Architectural Refactor

### ChatInput State Machine Migration

**Status:** ✅ Implemented

**Problem:**
The message composition logic relied on fragmented `useState` calls and manual string splicing, making features like multiple quotes and complex formatting fragile and hard to maintain.

**Solution:**
- Migrated `ChatInput` to a **Finite State Machine** pattern using `useReducer`.
- Created `ChatInputReducer.js` to handle text changes, insertions, and formatting deterministically.
- Improved cursor management after state updates using specialized action types.

**Files Changed:**
- `packages/react/src/hooks/ChatInputReducer.js`
- `packages/react/src/hooks/useChatInputState.js`
- `packages/react/src/hooks/useSendMessage.js`
- `packages/react/src/views/ChatInput/ChatInput.js`

### Attachment State Unification

**Status:** ✨ Implemented

**Major Enhancements:**
- **Unified State Machine:** Moved file/media attachment state into the `ChatInput` reducer.
- **Visual Feedback:** Introduced `AttachmentChip` components to show pending file uploads above the input box (similar to quotes).
- **Centralized Logic:** Consolidated attachment sending logic into the `useSendMessage` hook for better testability and reuse.
- **Improved Reliability:** File state is now managed deterministically alongside text and quotes, preventing stale state during failed sends.

**Files Changed:**
- `packages/react/src/views/ChatInput/AttachmentChip.js` (New)
- `packages/react/src/hooks/ChatInputReducer.js`
- `packages/react/src/hooks/useChatInputState.js`
- `packages/react/src/hooks/useSendMessage.js`
- `packages/react/src/views/ChatInput/ChatInput.js`
- `packages/react/src/views/AttachmentPreview/AttachmentPreview.js`

### Persistence & Resiliency

**Status:** ✨ Implemented

**Major Enhancements:**
- **Automatic Draft Recovery:** Unsent messages and quotes are now persisted to `localStorage` on a per-room basis.
- **Refresh Resilience:** If the page is refreshed or crashes, the user's content is automatically restored when they return to the room.
- **Clean State Management:** Drafts are automatically cleared upon successful message delivery, ensuring no stale content remains.

**Files Changed:**
- `packages/react/src/hooks/useDraftMessage.js` (New)
- `packages/react/src/hooks/useChatInputState.js`
- `packages/react/src/store/messageStore.js`

---

## 🎨 UI/UX Enhancements

### Compact Quote Chips

**Status:** ✨ Implemented

**Change:**
- Introduced `QuoteChip` component for compact, space-efficient previews of quoted messages.
- Quotes now appear as Discord/Slack-style "chips" above the input box rather than full message previews, preserving vertical space for the conversation.

**Files Changed:**
- `packages/react/src/views/ChatInput/QuoteChip.js` (New)
- `packages/react/src/views/ChatInput/ChatInput.js`
- `packages/react/src/views/ChatInput/ChatInput.styles.js`

### Slash Command Suggestions UI

**Status:** ✨ Implemented

**Major Enhancements:**
- **Keyboard-First Navigation:** Added full support for `ArrowUp`, `ArrowDown`, `Enter`, and `Tab` (terminal-style) to navigate and select commands.
- **Escape to Dismiss:** Users can now dismiss the command list instantly using the `Esc` key.
- **Improved UX:** Trailing space is now auto-inserted after selecting a command, making it ready for immediate parameter input.
- **Accessibility:** Added ARIA roles (`listbox`, `option`) and `aria-selected` state for screen reader support.
- **Optimized Event Handling:** Moved keydown listeners from the global `document` directly to the `messageRef` textarea to prevent event pollution.

**Files Changed:**
- `packages/react/src/views/CommandList/CommandsList.js`
- `packages/react/src/views/CommandList/CommandList.style.js`
- `packages/react/src/hooks/useShowCommands.js`

---

## ⚡ Performance Improvement

### Typing Indicator Timeout Optimization

**Status:** ✅ Implemented

**Change:**

- Reduced typing indicator timeout from 15 seconds to 10 seconds
- Makes the "typing..." status more responsive
- Improves real-time chat experience

**Files Changed:**

- `packages/react/src/views/ChatInput/ChatInput.js` (line 264)

**Commit:** `233457d0` - perf: reduce typing indicator timeout from 15s to 10s

---

## 📝 Testing

### Manual Testing Steps for Issue #1149:

1. Open chat and use Search Messages
2. Enter a query containing special characters: `hello&room?x#tag%`
3. Trigger search and verify:
   - Search executes successfully
   - Special characters are properly encoded in the URL
   - Search results are correct

### Manual Testing Steps for Typing Indicator:

1. Open chat
2. Start typing a message
3. Stop typing
4. Verify typing indicator disappears after 10 seconds (previously 15 seconds)

---

## 🔗 Related Issues

- Fixes #1149

---

## 📊 Impact

- **Security:** Prevents potential query injection through special characters
- **UX:** Faster typing indicator updates improve perceived responsiveness
- **Correctness:** Search now works correctly with all user input

---

## ✅ Checklist

- [x] Code follows project style guidelines
- [x] Changes are backward compatible
- [x] Commits follow conventional commit format
- [x] No breaking changes introduced
- [x] Ready for review
