import create from 'zustand';

const useMessageStore = create((set) => ({
  messages: [],
  setMessages: (messages) => set(() => ({ messages: messages })),
}));

export default useMessageStore;
