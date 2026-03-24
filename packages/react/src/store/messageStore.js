import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';
import { EC_OFFLINE_MESSAGES_KEY as PERSISTENCE_KEY } from '../lib/constants';

const getPersistedMessages = (rid) => {
  try {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    const allOffline = saved ? JSON.parse(saved) : {};
    return rid ? allOffline[rid] || [] : [];
  } catch (e) {
    console.error('Error loading persisted messages', e);
    return [];
  }
};

const savePersistedMessages = (rid, messages) => {
  try {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    const allOffline = saved ? JSON.parse(saved) : {};
    if (messages && messages.length > 0) {
      allOffline[rid] = messages;
    } else {
      delete allOffline[rid];
    }
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(allOffline));
  } catch (e) {
    console.error('Error saving persisted messages', e);
  }
};

const clearOfflineMessages = () => {
  try {
    localStorage.removeItem(PERSISTENCE_KEY);
  } catch (e) {
    console.error('Error clearing persisted messages', e);
  }
};

const useMessageStore = create((set, get) => ({
  messages: [],
  rid: null,
  setRid: (rid) => set({ rid }),
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
        : [...getPersistedMessages(state.rid), ...newMessages];

      const uniqueMessages = Array.from(
        new Map(allMessages.map((msg) => [msg._id, msg])).values()
      ).sort((a, b) => new Date(b.ts) - new Date(a.ts));
      return {
        messages: uniqueMessages,
        isMessageLoaded: true,
      };
    }),
  upsertMessage: (message, enableThreads = false) => {
    if (message.isError) {
      const offlineMessages = getPersistedMessages(message.rid);
      const updatedOffline = upsertMessage(offlineMessages, message);
      savePersistedMessages(message.rid, updatedOffline);
    }

    if (message.tmid && enableThreads) {
      if (get().threadMainMessage?._id === message.tmid) {
        set((state) => ({
          threadMessages: upsertMessage(state.threadMessages, message),
        }));
      }
    } else {
      set((state) => ({
        messages: upsertMessage(state.messages, message).sort(
          (a, b) => new Date(b.ts) - new Date(a.ts)
        ),
      }));
    }
  },
  removeMessage: (messageId) => {
    const currentMessages = get().messages;
    const targetMessage = currentMessages.find((m) => m._id === messageId);
    if (targetMessage && targetMessage.isError) {
      const offlineMessages = getPersistedMessages(targetMessage.rid);
      const updatedOffline = offlineMessages.filter((m) => m._id !== messageId);
      savePersistedMessages(targetMessage.rid, updatedOffline);
    }

    const threadMessage = get().threadMessages.find((m) => m._id === messageId);
    if (threadMessage) {
      return set((state) => ({
        deletedMessage: threadMessage,
        threadMessages: cloneArray(state.threadMessages).filter(
          (m) => m._id !== messageId
        ),
      }));
    }
    if (targetMessage) {
      return set((state) => ({
        deletedMessage: targetMessage,
        messages: cloneArray(state.messages).filter((m) => m._id !== messageId),
      }));
    }
  },
  replaceMessage: (oldMessageId, newMessage) => {
    const offlineMessages = getPersistedMessages(newMessage.rid);
    let updatedOffline;
    if (newMessage.isError) {
      updatedOffline = upsertMessage(offlineMessages, newMessage);
    } else {
      updatedOffline = offlineMessages.filter((m) => m._id !== oldMessageId);
    }
    savePersistedMessages(newMessage.rid, updatedOffline);

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
        messages: cloneArray(state.messages)
          .map((m) => (m._id === oldMessageId ? newMessage : m))
          .sort((a, b) => new Date(b.ts) - new Date(a.ts)),
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
  clearOfflineMessages: () => {
    clearOfflineMessages();
  },
}));

export default useMessageStore;
