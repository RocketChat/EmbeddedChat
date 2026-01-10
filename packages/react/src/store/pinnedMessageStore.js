import { create } from 'zustand';
import { getMessageById } from '../../lib/api';
import { useMessageStore } from '../messageStore';

const usePinnedMessageStore = create((set) => ({
  showPinned: false,
  isJumping: false,
  error: null,

  setShowPinned: (showPinned) => set({ showPinned }),

  resetError: () => set({ error: null }),
  jumpToMessage: async (messageId) => {
    const { messages, addMessages } = useMessageStore.getState();

    set({ isJumping: true, error: null });

    try {
      const alreadyLoaded = messages.some(
        (msg) => msg._id === messageId
      );

      if (alreadyLoaded) return;

      const message = await getMessageById(messageId);

      if (message) {
        addMessages([message]);
      }
    } catch (err) {
      set({ error: 'Failed to load pinned message' });
      console.error(err);
    } finally {
      set({ isJumping: false });
    }
  },
}));

export default usePinnedMessageStore;

