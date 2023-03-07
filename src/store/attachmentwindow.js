import create from 'zustand';

const useAttachmentWindowStore = create((set) => ({
  open: false,
  data: null,
  toggle: () => set((state) => ({ open: !state.open })),
  setData: (file) => {
    set({ data: file });
  },
}));

export default useAttachmentWindowStore;
