import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';

const useMessageStore = create((set, get) => ({
  messages: [],
  isMessageLoaded: false,
  threadMessages: [],
  filtered: false,
  editMessage: {},
  quoteMessage: {},
  messageToReport: NaN,
  showReportMessage: false,
  isRecordingMessage: false,
  isThreadOpen: false,
  threadMainMessage: null,
  headerTitle: null,
  setFilter: (filter) => set(() => ({ filtered: filter })),
  setMessages: (messages) =>
    set(() => ({
      messages,
      isMessageLoaded: true,
    })),
  upsertMessage: (message, enableThreads = false) => {
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
    const threadMessage = get().threadMessages.find((m) => m._id === messageId);
    const message = get().messages.find((m) => m._id === messageId);
    if (threadMessage) {
      return set((state) => ({
        threadMessages: cloneArray(state.threadMessages).filter(
          (m) => m._id !== messageId
        ),
      }));
    }
    if (message) {
      return set((state) => ({
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
  setQuoteMessage: (quoteMessage) => set(() => ({ quoteMessage })),
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
  setThreadMessages: (messages) => set(() => ({ threadMessages: messages })),
  setHeaderTitle: (title) => set(() => ({ headerTitle: title })),
}));

export default useMessageStore;
