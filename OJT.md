# OJT Project Kickoff

- **Project:** Rocket.Chat EmbeddedChat
- **Selected issue:** [#1080 – Thread UI remains open after parent message is deleted](https://github.com/RocketChat/EmbeddedChat/issues/1080)
- **Goal:** Investigate why deleting the parent of an open thread can leave the thread pane showing stale state, then verify the appropriate behavior.

## Setup and reproduction completed

- Set up EmbeddedChat locally with Storybook connected to a local Rocket.Chat server.
- Reproduced the issue in the Storybook chat: after deleting a parent message, it showed as “message removed,” while its thread remained open and its reply was still accessible.

## Code path traced

- `packages/api/src/EmbeddedChatApi.ts`: subscribes to room delete events through the Rocket.Chat SDK’s DDP stream and passes the deleted message ID to registered callbacks.
- `packages/react/src/views/ChatBody/ChatBody.js`: registers the store’s `removeMessage` action as a delete listener and renders the thread view when `isThreadOpen` is true.
- `packages/react/src/store/messageStore.js`: stores `isThreadOpen`, `threadMainMessage`, and `threadMessages`. The current `removeMessage` action removes deleted messages from the message arrays, while `closeThread` clears the active thread state.
- `packages/react/src/views/Thread/ThreadMessageList.js`: renders the active thread and its messages.

## Current understanding

The root cause is a client-side **UI State Leak** in Zustand state management across two distinct deletion mechanisms in Rocket.Chat:

1. **Hard Delete (0 Replies / Direct Delete)**:
   - When a parent message with no replies is deleted, Rocket.Chat fires a WebSocket delete event (`notify-room: ${this.rid}/deleteMessage`).
   - `removeMessage(messageId)` in `messageStore.js` is triggered. While it filtered the message out of `messages`, it previously left `isThreadOpen: true` and `threadMainMessage` intact.

2. **Soft Delete / Tombstone (>= 1 Replies Exist)**:
   - When a parent message with existing thread replies is deleted, Rocket.Chat does *not* hard-delete the record (to avoid orphaning child replies). Instead, it broadcasts a regular message update via `room-messages` with `message.t = 'rm'` (which displays as *"message removed"* in the UI).
   - This update bypasses `removeMessage` and lands in **`upsertMessage(message)`** in `messageStore.js`.
   - Previously, `upsertMessage` only updated the message in `messages` without checking if the active thread's parent was just marked as `'rm'`, leaving the thread view open.

### Key Insights & Edge Cases Considered
1. **Frontend Scope vs. Backend Scope**: EmbeddedChat is purely a frontend client library. Regardless of how the Rocket.Chat server manages thread reply persistence, the frontend is responsible for closing an active thread UI when its parent message is deleted/removed.
2. **Selective Closing**: Calling `closeThread()` unconditionally would introduce regressions: deleting an unrelated message in the main channel while viewing a thread would snap the active thread shut.
3. **Dual-Path Handling**: We must protect both deletion paths:
   - `removeMessage`: checks `get().threadMainMessage?._id === messageId`.
   - `upsertMessage`: checks `message.t === 'rm' && get().threadMainMessage?._id === message._id`.

---

## Implemented Solution & Testing

Both paths have been implemented in `packages/react/src/store/messageStore.js`:

```javascript
  upsertMessage: (message, enableThreads = false) => {
    // 1. Soft-delete check: close thread if the active parent message was marked as removed
    if (message.t === 'rm' && get().threadMainMessage?._id === message._id) {
      get().closeThread();
    }

    if (message.tmid && enableThreads) {
      if (get().threadMainMessage?._id === message.tmid) {
        set((state) => ({
          threadMessages: upsertMessage(state.threadMessages, message),
        }));
      }
    } else {
      set((state) => ({
        messages: upsertMessage(state.messages, message),
      }));
    }
  },

  removeMessage: (messageId) => {
    // 2. Hard-delete check: close thread if the active parent message was deleted
    if (get().threadMainMessage?._id === messageId) {
      get().closeThread();
    }

    const threadMessage = get().threadMessages.find((m) => m._id === messageId);
    const message = get().messages.find((m) => m._id === messageId);
    if (threadMessage) {
      return set((state) => ({
        deletedMessage: threadMessage,
        threadMessages: cloneArray(state.threadMessages).filter(
          (m) => m._id !== messageId
        ),
      }));
    }
    if (message) {
      return set((state) => ({
        deletedMessage: message,
        messages: cloneArray(state.messages).filter((m) => m._id !== messageId),
      }));
    }
  },
```

### Testing Results Completed:
- **`removeMessage` with 0 replies**: Tested and verified. When a parent message with no replies is deleted while the thread view is open, the thread view closes immediately.
- **`upsertMessage` with multiple replies**: Tested and verified. When a parent message with existing replies is deleted while the thread view is open, the incoming `t: 'rm'` event immediately closes the thread view.

---

## Secondary Investigation: Hiding "View thread" on Deleted Messages

Following discussion with the mentor regarding whether the `[View thread]` button should remain accessible once a parent message is deleted:

### Problem Identified in UI
In `packages/react/src/views/Message/Message.js` (line 376), thread metrics were conditionally rendered solely based on `message.tcount`:
```javascript
{message.tcount && type !== 'thread' ? (
  <MessageMetrics ... />
) : null}
```
Because this check did not inspect `message.t`, messages that were soft-deleted (`message.t === 'rm'`) continued to display the `[View thread]` button and reply counter beneath the *"message removed"* placeholder, allowing users to open the thread.

### Technical Concept: What is `message.t`?
In Rocket.Chat's database schema:
- **`t`** represents the **System Message Type**.
- For regular chat messages, `message.t` is `undefined` (`!message.t` is `true`).
- When a message is deleted with replies, Rocket.Chat sets `message.t = 'rm'` (removed) and clears `msg`.
- Existing components in `Message.js` already guard against system messages using `!message.t` (e.g., hiding the message text body at line 269 and the hover toolbox at line 305).

### Implementation in `Message.js`
Updated line 376 to match the rest of `Message.js` by guarding with `!message.t`:

```javascript
{!message.t && message.tcount && type !== 'thread' ? (
  <MessageMetrics
    message={message}
    handleOpenThread={handleOpenThread}
    variantStyles={variantStyles}
  />
) : null}
```

### Testing Results Completed:
- Verified in Storybook: When a parent message is deleted, the `[View thread]` button and reply count immediately disappear alongside the message body, leaving only the *"message removed"* tombstone.

---

## Status & PR Strategy

We now have two distinct, independently verified solutions ready to present:

1. **Primary Fix (Issue #1080 - Core State Leak)**:
   - Changes in `packages/react/src/store/messageStore.js` (`upsertMessage` and `removeMessage`).
   - Ensures that an active, open thread view always closes if its parent message is deleted (handling both 0-reply hard deletes and multi-reply soft deletes).

2. **Secondary UI Enhancement (`Message.js`)**:
   - Guard in `packages/react/src/views/Message/Message.js` hiding the `[View thread]` button on deleted parent messages.
   - If maintainers want thread replies hidden when a parent is deleted, this patch can be included. If maintainers prefer preserving thread reply accessibility under tombstones (like Slack/Discord), the primary fix alone can be submitted.

---

## Next Steps

1. Run existing automated unit tests for `messageStore` and UI components.
2. Generate a changeset (`npx changeset`) for `@embeddedchat/react`.
3. Open PR with the primary fix and present the secondary enhancement to maintainers for guidance.