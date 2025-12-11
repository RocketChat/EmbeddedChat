import { create } from 'zustand';

const useThemeStore = create((set) => ({
    isDarkMode: false,
    setIsDarkMode: (isDarkMode) => set(() => ({ isDarkMode })),
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

export default useThemeStore;
