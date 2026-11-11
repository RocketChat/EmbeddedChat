import { create } from 'zustand';

const usePinnedMessageStore = create((set) => ({
  showPinned: false,
  setShowPinned: (showPinned) => set(() => ({ showPinned })),
  pinnedMessages: [],
  setPinnedMessages: (messages) =>
    set(() => ({ pinnedMessages: Array.isArray(messages) ? messages : [] })),
  updatePinnedMessage: (message) =>
    set((state) => {
      if (!message || !message._id) return state;
      if (message.pinned) {
        const index = state.pinnedMessages.findIndex(
          (m) => m._id === message._id
        );
        if (index !== -1) {
          const updated = [...state.pinnedMessages];
          updated[index] = { ...updated[index], ...message };
          return { pinnedMessages: updated };
        }
        return { pinnedMessages: [message, ...state.pinnedMessages] };
      }
      return {
        pinnedMessages: state.pinnedMessages.filter(
          (m) => m._id !== message._id
        ),
      };
    }),
  removePinnedMessage: (messageId) =>
    set((state) => ({
      pinnedMessages: state.pinnedMessages.filter((m) => m._id !== messageId),
    })),
  dismissedRooms: {},
  dismissBannerForRoom: (roomId) =>
    set((state) => ({
      dismissedRooms: {
        ...state.dismissedRooms,
        [roomId]: true,
      },
    })),
  resetDismissedRooms: () => set(() => ({ dismissedRooms: {} })),
}));

export default usePinnedMessageStore;
