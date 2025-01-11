import { create } from 'zustand';

const usePinnedMessageStore = create((set) => ({
  showPinned: false,
  setShowPinned: (showPinned) => set(() => ({ showPinned })),
  PinnedMessage: [],
  setPinnedMessages: (PinnedMessage) => set(() => ({ PinnedMessage })),
}));

export default usePinnedMessageStore;
