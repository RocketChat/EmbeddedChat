import create from 'zustand';
import cloneArray from '../lib/cloneArray';

// Caution: Not a pure function
const insertMessage = (messages, message) => {
  const idx = messages.findIndex((m) => new Date(m.ts) < new Date(message.ts));
  if (idx === -1) {
    // all the messages are newer than the current message, insert at last
    messages.push(message);
  } else if (idx === 0) {
    // the message is the latest one, insert at front
    messages.unshift(message);
  } else {
    messages.splice(idx, 0, message);
  }
  return messages;
};

/**
 * Inserts the message or updates if already present in the list. Makes a copy of the messages[].
 * @param {*} messages
 * @param {*} message
 * @returns newMessageList
 */
const upsertMessage = (messages, message) => {
  const newMessages = cloneArray(messages);
  const idx = newMessages.findIndex((m) => m._id === message._id);
  if (idx === -1) {
    // the message is new, insert it.
    return insertMessage(newMessages, message);
  }
  // message with the given id is present. update it.
  newMessages[idx] = message;
  return newMessages;
};

const useMessageStore = create((set) => ({
  messages: [],
  filtered: false,
  editMessage: {},
  messageToReport: NaN,
  showReportMessage: false,
  isRecordingMessage: false,
  setFilter: (filter) => set(() => ({ filtered: filter })),
  setMessages: (messages) => set(() => ({ messages })),
  upsertMessage: (message) =>
    set((state) => ({
      messages: upsertMessage(state.messages, message),
    })),
  removeMessage: (messageId) =>
    set((state) => ({
      messages: cloneArray(state.messages).filter((m) => m._id !== messageId),
    })),
  setEditMessage: (editMessage) => set(() => ({ editMessage })),
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
}));

export default useMessageStore;
