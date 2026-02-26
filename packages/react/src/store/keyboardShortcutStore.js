import { create } from 'zustand';

const useKeyboardShortcutStore = create((set) => ({
  showKeyboardShortcuts: false,
  setShowKeyboardShortcuts: (showKeyboardShortcuts) =>
    set(() => ({ showKeyboardShortcuts })),
}));

export default useKeyboardShortcutStore;
