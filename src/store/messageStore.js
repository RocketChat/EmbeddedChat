import create from 'zustand';

const useMessageStore = create((set) => ({
  messages: [],
  filtered: false,
  editMessage: {},
  messageToReport: NaN,
  showReportMessage: false,
  isRecordingMessage: false,
  setFilter: (filter) => set((state) => ({ ...state, filtered: filter })),
  setMessages: (messages) => set((state) => ({ ...state, messages })),
  setEditMessage: (editMessage) => set(() => ({ editMessage })),
  setMessageToReport: (messageId) =>
    set((state) => ({ ...state, messageToReport: messageId })),
  toggleShowReportMessage: () => {
    set((state) => ({ ...state, showReportMessage: !state.showReportMessage }));
  },
  toogleRecordingMessage: () => {
    set((state) => ({
      ...state,
      isRecordingMessage: !state.isRecordingMessage,
    }));
  },
}));

export default useMessageStore;
