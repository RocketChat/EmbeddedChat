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

The root cause is a client-side **UI State Leak** in Zustand state management:
- When a parent message is deleted on the server, Rocket.Chat sends a delete event over DDP WebSocket (`notify-room: ${this.rid}/deleteMessage`).
- `removeMessage(messageId)` in `messageStore.js` is triggered. It finds the message in `messages` and filters it out.
- However, Zustand retains all other store variables unless explicitly updated. Thus, `isThreadOpen` remains `true` and `threadMainMessage` continues to hold the deleted parent message object.
- Because `ChatBody.js` conditionally renders `<ThreadMessageList>` whenever `isThreadOpen` is `true`, the thread panel stays open on the screen with stale data.

### Key Insights & Edge Cases Considered
1. **Frontend Scope vs. Backend Scope**: EmbeddedChat is purely a frontend client library. Regardless of how the Rocket.Chat server manages thread reply persistence, the frontend is responsible for closing the thread UI when its parent message is removed from the room.
2. **Selective Closing**: Calling `closeThread()` unconditionally inside `removeMessage()` would introduce a regression: deleting an unrelated message (e.g. Message B in main chat) while viewing Message A's thread would cause Message A's thread to unexpectedly close.
3. **Targeted Condition**: We must compare `get().threadMainMessage?._id === messageId`. Only when the deleted message is the parent of the currently active thread should `closeThread()` be invoked.

## Proposed Solution (Pending Verification)

Add a targeted parent check at the beginning of `removeMessage` in `packages/react/src/store/messageStore.js`:

```javascript
  removeMessage: (messageId) => {
    // If the deleted message is the parent of the currently open thread, close it
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

## Next steps & Verification Plan

1. **Manual Testing in Storybook**:
   - **Positive Test (Bug Fix)**: Open thread on parent Message A -> delete Message A -> verify the thread view closes and returns cleanly to the main channel message list.
   - **Negative Test (Regression Check)**: Open thread on Message A -> delete unrelated Message B in the main channel -> verify Message A's thread remains open.
2. **Automated Unit Tests**:
   - Run existing unit tests for `messageStore` to ensure no regressions.
   - Add a unit test verifying `removeMessage` closes the active thread when the parent message is deleted.
3. **Changeset**:
   - Run `npx changeset` to create a patch release entry for `@embeddedchat/react`.