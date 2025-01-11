import { create } from 'zustand';

const useChatInputItemsStore = create((set) => ({
  surfaceItems: ['emoji', 'formatter', 'link', 'audio', 'video', 'file'],
  formatters: ['bold', 'italic', 'strike', 'code', 'multiline'],
  setSurfaceItems: (items) => set({ surfaceItems: items }),
  setFormatters: (items) => set({ formatters: items }),
}));

export default useChatInputItemsStore;
