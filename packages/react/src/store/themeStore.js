import { create } from 'zustand';

const useThemeStore = create((set) => ({
  mode: 'light',
  setDark: () => set({ mode: 'dark' }),
  setLight: () => set({ mode: 'light' }),
  toggleMode: () =>
    set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),

  messageVariant: 'flat',
  setMessageVariant: (variant) => set({ messageVariant: variant }),
}));

export default useThemeStore;
