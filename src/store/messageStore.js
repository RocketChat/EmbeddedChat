import create from 'zustand';

const useMessageStore = create((set) => ({
  messages: [],
  filtered: false,
  editMessage: {},
  setFilter: (filter) => set((state) => ({ ...state, filtered: filter })),
  setMessages: (messages) => set((state) => ({ ...state, messages })),
  setEditMessage: (editMessage) => set(() => ({ editMessage })),
}));

export default useMessageStore;
