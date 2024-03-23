import { create } from 'zustand';

const usePinnedMessageStore = create((set) => ({
  showPinned: false,
  setShowPinned: (showPinned) => set(() => ({ showPinned })),
}));

export default usePinnedMessageStore;
