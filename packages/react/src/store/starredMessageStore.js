import { create } from 'zustand';

const useStarredMessageStore = create((set) => ({
  showStarred: false,
  setShowStarred: (showStarred) => set(() => ({ showStarred })),
  starredMessages: [],
  setStarredMessages: (messages) => set(() => ({ starredMessages: messages })),
}));

export default useStarredMessageStore;
