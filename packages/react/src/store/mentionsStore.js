import { create } from 'zustand';

const useMentionsStore = create((set) => ({
  showMentions: false,
  setShowMentions: (showMentions) => set(() => ({ showMentions })),
}));

export default useMentionsStore;
