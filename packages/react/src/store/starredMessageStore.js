import { create } from 'zustand';

const useStarredMessageStore = create((set) => ({
  showStarred: false,
  setShowStarred: (showStarred) => set(() => ({ showStarred })),
}));

export default useStarredMessageStore;
