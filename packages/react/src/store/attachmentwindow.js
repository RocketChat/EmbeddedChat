import { create } from 'zustand';

const useAttachmentWindowStore = create((set) => ({
  attachmentWindowOpen: false,
  data: [],
  toggle: () =>
    set((state) => ({ attachmentWindowOpen: !state.attachmentWindowOpen })),
  setData: (file) => {
    set({ data: file });
  },
}));

export default useAttachmentWindowStore;
