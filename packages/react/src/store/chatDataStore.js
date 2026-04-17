import { create } from 'zustand';

const useChatDataStore = create((set) => ({
  starredMessages: [],
  setStarredMessages: (messages) => set({ starredMessages: messages || [] }),
}));

export default useChatDataStore;

