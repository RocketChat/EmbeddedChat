import create from 'zustand';

const useMessageStore = create((set) => ({
  messages: [],
  filtered: false,
  setFilter: (filter) => set((state) => ({ ...state, filtered: filter })),
  setMessages: (messages) => set((state) => ({ ...state, messages })),
}));

export default useMessageStore;
