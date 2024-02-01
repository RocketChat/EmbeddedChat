import { create } from 'zustand';

const useThreadsMessageStore = create((set) => ({
  showAllThreads: false,
  setShowAllThreads: (showAllThreads) => set(() => ({ showAllThreads })),
}));

export default useThreadsMessageStore;
