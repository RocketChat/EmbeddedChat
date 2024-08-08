import { create } from 'zustand';

const useLayoutStore = create((set) => ({
  themeLabOpen: false,
  setThemeLabOpen: (themeLabOpen) => {
    set({ themeLabOpen });
  },

  messageView: 'flat',
  setMessageView: (messageView) => {
    set({ messageView });
  },

  displayName: 'normal',
  setDisplayName: (displayName) => {
    set({ displayName });
  },

  sidebarWidth: '350px',
  setSidebarWidth: (sidebarWidth) => {
    set({ sidebarWidth });
  },
}));

export default useLayoutStore;
