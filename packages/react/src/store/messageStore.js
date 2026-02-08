import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';
import useUserStore from './userStore';

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
  lastNewThreadMessageAt: null,
  threadIdsWithNewReplies: [],
  threadIdsWithMentions: [],
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
      const state = get();
      const currentUserId = useUserStore.getState().userId;
      console.log(currentUserId)
      const hasMention = message.mentions?.some(
        (mention) => mention._id === currentUserId
      ); 
      const isOpenThread = state.threadMainMessage?._id === message.tmid;
      set((s) => {
        console.log(s)
        const nextThreadMessages = isOpenThread
          ? upsertMessage(s.threadMessages, message)
          : s.threadMessages;
        const alreadyHasNew = s.threadIdsWithNewReplies.includes(message.tmid);
        const nextThreadIdsWithNewReplies = alreadyHasNew
          ? s.threadIdsWithNewReplies
          : [...s.threadIdsWithNewReplies, message.tmid];
        const nextThreadIdsWithMentions = hasMention
          ? [...s.threadIdsWithMentions, message.tmid]
          : s.threadIdsWithMentions;
        return {
          threadMessages: nextThreadMessages,
          lastNewThreadMessageAt: isOpenThread
            ? (message.ts ?? new Date().toISOString())
            : s.lastNewThreadMessageAt,
          threadIdsWithNewReplies: nextThreadIdsWithNewReplies,
          threadIdsWithMentions: nextThreadIdsWithMentions,
        };
      });
    } else {
      set((state) => ({
        messages: upsertMessage(state.messages, message),
      }));
    }
  },
  removeMessage: (messageId) => {
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
  replaceMessage: (oldMessageId, newMessage) => {
    const threadMessage = get().threadMessages.find(
      (m) => m._id === oldMessageId
    );
    const message = get().messages.find((m) => m._id === oldMessageId);
    if (threadMessage) {
      return set((state) => ({
        threadMessages: cloneArray(state.threadMessages).map((m) =>
          m._id === oldMessageId ? newMessage : m
        ),
      }));
    }
    if (message) {
      return set((state) => ({
        messages: cloneArray(state.messages).map((m) =>
          m._id === oldMessageId ? newMessage : m
        ),
      }));
    }
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
    set((state) => ({
      isThreadOpen: true,
      threadMainMessage: message,
      threadMessages: [],
      lastNewThreadMessageAt: null,
      threadIdsWithNewReplies: state.threadIdsWithNewReplies.filter(
        (id) => id !== message._id
      ),
      threadIdsWithMentions: state.threadIdsWithMentions.filter(
        (id) => id !== message._id
      ),
    }));
  },
  closeThread: () => {
    set((state) => {
      const closedThreadId = state.threadMainMessage?._id;
      return {
        isThreadOpen: false,
        threadMainMessage: null,
        threadMessages: [],
        lastNewThreadMessageAt: null,
        threadIdsWithNewReplies: closedThreadId
          ? state.threadIdsWithNewReplies.filter((id) => id !== closedThreadId)
          : state.threadIdsWithNewReplies,
        threadIdsWithMentions: closedThreadId
          ? state.threadIdsWithMentions.filter((id) => id !== closedThreadId)
          : state.threadIdsWithMentions,
      };
    });
  },
  clearNewThreadMessageSignal: () =>
    set({ lastNewThreadMessageAt: null }),
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
