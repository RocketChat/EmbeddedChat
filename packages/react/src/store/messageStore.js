import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';

const useMessageStore = create((set, get) => ({
  messages: [],
  isMessageLoaded: false,
  threadMessages: [],
  filtered: false,
  editMessage: {},
  deletedMessage: {},
  messagesOffset: 0,
  quoteMessage: [],
  deleteMessageRoles: {},
  deleteOwnMessageRoles: {},
  forceDeleteMessageRoles: {},
  messageToReport: NaN,
  showReportMessage: false,
  isRecordingMessage: false,
  isThreadOpen: false,
  threadMainMessage: null,
  headerTitle: null,
  setFilter: (filter) => set(() => ({ filtered: filter })),
  setMessages: (newMessages, append = false) =>
    set((state) => {
      const allMessages = append
        ? [...state.messages, ...newMessages]
        : newMessages;
      const uniqueMessages = Array.from(
        new Map(allMessages.map((msg) => [msg._id, msg])).values()
      );
      return {
        messages: uniqueMessages,
        isMessageLoaded: true,
      };
    }),
  upsertMessage: (message, enableThreads = false) => {
    if (message.tmid && enableThreads) {
      const parentId = message.tmid;
      const isOpenThread = get().threadMainMessage?._id === parentId;
      const isExistingInThread = get().threadMessages.some(
        (m) => m._id === message._id
      );

      set((state) => {
        const nextState = {};

        if (isOpenThread) {
          nextState.threadMessages = upsertMessage(
            state.threadMessages,
            message
          );
          if (state.threadMainMessage) {
            nextState.threadMainMessage = {
              ...state.threadMainMessage,
              tcount:
                (state.threadMainMessage.tcount || 0) +
                (isExistingInThread ? 0 : 1),
              tlm: message.ts || new Date().toISOString(),
            };
          }
        }

        const parentIdx = state.messages.findIndex((m) => m._id === parentId);
        if (parentIdx !== -1) {
          const parent = state.messages[parentIdx];
          const newReplies = parent.replies
            ? message.u?._id && !parent.replies.includes(message.u._id)
              ? [...parent.replies, message.u._id]
              : parent.replies
            : message.u?._id
            ? [message.u._id]
            : [];

          const updatedParent = {
            ...parent,
            tcount: (parent.tcount || 0) + (isExistingInThread ? 0 : 1),
            tlm: message.ts || new Date().toISOString(),
            replies: newReplies,
          };

          const newMessages = cloneArray(state.messages);
          newMessages[parentIdx] = updatedParent;
          nextState.messages = newMessages;
        }

        return nextState;
      });
    } else {
      set((state) => {
        const isMainThreadMessage =
          state.threadMainMessage?._id === message._id;
        return {
          messages: upsertMessage(state.messages, message),
          ...(isMainThreadMessage
            ? {
                threadMainMessage: {
                  ...state.threadMainMessage,
                  ...message,
                },
              }
            : {}),
        };
      });
    }
  },
  removeMessage: (messageId, parentId) => {
    const threadMessage = get().threadMessages.find((m) => m._id === messageId);
    const message = get().messages.find((m) => m._id === messageId);
    const effectiveParentId = parentId || threadMessage?.tmid;

    if (effectiveParentId) {
      return set((state) => ({
        deletedMessage: threadMessage || message || { _id: messageId },
        threadMessages: cloneArray(state.threadMessages).filter(
          (m) => m._id !== messageId
        ),
        threadMainMessage:
          state.threadMainMessage?._id === effectiveParentId
            ? {
                ...state.threadMainMessage,
                tcount: Math.max(0, (state.threadMainMessage.tcount || 1) - 1),
              }
            : state.threadMainMessage,
        messages: cloneArray(state.messages)
          .filter((m) => m._id !== messageId)
          .map((m) => {
            if (m._id !== effectiveParentId) return m;
            return {
              ...m,
              tcount: Math.max(0, (m.tcount || 1) - 1),
            };
          }),
      }));
    }

    if (message || get().threadMainMessage?._id === messageId) {
      const shouldCloseThread = get().threadMainMessage?._id === messageId;
      return set((state) => ({
        deletedMessage: message || { _id: messageId },
        messages: cloneArray(state.messages).filter((m) => m._id !== messageId),
        ...(shouldCloseThread
          ? {
              isThreadOpen: false,
              threadMainMessage: null,
              threadMessages: [],
            }
          : {}),
      }));
    }
  },
  replaceMessage: (oldMessageId, newMessage) => {
    set((state) => {
      const isThreadMsg = state.threadMessages.some(
        (m) => m._id === oldMessageId
      );
      const isMainMsg = state.messages.some((m) => m._id === oldMessageId);
      const isMainThreadMsg = state.threadMainMessage?._id === oldMessageId;

      return {
        ...(isThreadMsg
          ? {
              threadMessages: cloneArray(state.threadMessages).map((m) =>
                m._id === oldMessageId ? newMessage : m
              ),
            }
          : {}),
        ...(isMainMsg
          ? {
              messages: cloneArray(state.messages).map((m) =>
                m._id === oldMessageId ? newMessage : m
              ),
            }
          : {}),
        ...(isMainThreadMsg
          ? {
              threadMainMessage: {
                ...state.threadMainMessage,
                ...newMessage,
              },
            }
          : {}),
      };
    });
  },

  setEditMessage: (editMessage) => set(() => ({ editMessage })),
  setMessagesOffset: (newOffset) => set(() => ({ messagesOffset: newOffset })),
  editMessagePermissions: {},
  setEditMessagePermissions: (editMessagePermissions) =>
    set((state) => ({ ...state, editMessagePermissions })),
  addQuoteMessage: (quoteMessage) =>
    set((state) => {
      const updatedQuoteMessages = state.quoteMessage.filter(
        (msg) => msg._id !== quoteMessage._id
      );
      return { quoteMessage: [...updatedQuoteMessages, quoteMessage] };
    }),
  removeQuoteMessage: (quoteMessage) =>
    set((state) => ({
      quoteMessage: state.quoteMessage.filter((i) => i !== quoteMessage),
    })),

  clearQuoteMessages: () => set({ quoteMessage: [] }),
  setMessageToReport: (messageId) =>
    set(() => ({ messageToReport: messageId })),
  toggleShowReportMessage: () => {
    set((state) => ({ showReportMessage: !state.showReportMessage }));
  },
  toogleRecordingMessage: () => {
    set((state) => ({
      isRecordingMessage: !state.isRecordingMessage,
    }));
  },
  openThread: (message) => {
    set(() => ({
      isThreadOpen: true,
      threadMainMessage: message,
      threadMessages: [],
    }));
  },
  closeThread: () => {
    set(() => ({
      isThreadOpen: false,
      threadMainMessage: null,
      threadMessages: [],
    }));
  },
  setDeleteMessageRoles: (deleteMessageRoles) =>
    set((state) => ({ ...state, deleteMessageRoles })),
  setDeleteOwnMessageRoles: (deleteOwnMessageRoles) =>
    set((state) => ({ ...state, deleteOwnMessageRoles })),
  setForceDeleteMessageRoles: (forceDeleteMessageRoles) =>
    set((state) => ({ ...state, forceDeleteMessageRoles })),
  setThreadMessages: (messages) => set(() => ({ threadMessages: messages })),
  setHeaderTitle: (title) => set(() => ({ headerTitle: title })),
}));

export default useMessageStore;
