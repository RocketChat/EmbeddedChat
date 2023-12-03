import { create } from 'zustand';
import cloneArray from '../lib/cloneArray';
import { upsertMessage } from '../lib/messageListHelpers';

const useMessageStore = create((set, get) => ({
  messages: [],
  threadMessages: [],
  filtered: false,
  editMessage: {},
  messageToReport: NaN,
  showReportMessage: false,
  isRecordingMessage: false,
  isThreadOpen: false,
  threadMainMessage: null,
  setFilter: (filter) => set(() => ({ filtered: filter })),
  setMessages: (messages) => set(() => ({ messages })),
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
  setMessageToReport: (messageId) =>
    set(() => ({ messageToReport: messageId })),
  toggleShowReportMessage: () => {
    set((state) => ({ showReportMessage: !state.showReportMessage }));
  },
  setMessageToDelete: (messageId) =>
    set(() => ({ messageToDelete: messageId, showDeleteMessage: true })),
  toggleShowDeleteMessage: () => {
    set((state) => ({ showDeleteMessage: !state.showDeleteMessage }));
  },
  deleteMessage: async () => {
    const messageId = get().messageToDelete;

    set((state) => ({
      messages: cloneArray(state.messages).filter((m) => m._id !== messageId),
      threadMessages: cloneArray(state.threadMessages).filter(
        (m) => m._id !== messageId
      ),
      messageToDelete: null, // Clear the messageToDelete after deletion
      showDeleteMessage: false, // Close the modal after deletion
    }));
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
}));

export default useMessageStore;
