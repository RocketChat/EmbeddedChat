import { create } from 'zustand';

const usePinnedMessageStore = create((set) => ({
  showPinned: false,
  setShowPinned: (showPinned) => set(() => ({ showPinned })),
  pinnedMessages: [],
  setPinnedMessages: (messages) => set(() => ({ pinnedMessages: messages })),
}));

export default usePinnedMessageStore;
