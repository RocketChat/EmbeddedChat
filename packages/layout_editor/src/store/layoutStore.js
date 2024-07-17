import { create } from 'zustand';

const useLayoutStore = create((set) => ({
  themeLabOpen: false,
  setThemeLabOpen: (themeLabOpen) => {
    set({ themeLabOpen });
  },
}));

export default useLayoutStore;
