// themeStore.js
import create from 'zustand';

const useThemeStore = create((set) => ({
  isDarkTheme: false, // Initially, assume it's the light theme

  toggleTheme: () => {
    set((state) => ({ isDarkTheme: !state.isDarkTheme }));
  },
}));

export default useThemeStore;
