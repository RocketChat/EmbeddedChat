import { create } from 'zustand';

const useSearchMessageStore = create((set) => ({
  showSearch: false,
  setShowSearch: (showSearch) => set(() => ({ showSearch })),
}));

export default useSearchMessageStore;
