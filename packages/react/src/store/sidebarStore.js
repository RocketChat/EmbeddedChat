import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  showSidebar: false,
  setShowSidebar: (showSidebar) => set(() => ({ showSidebar })),
}));

export default useSidebarStore;
