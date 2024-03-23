import { create } from 'zustand';

const useFileStore = create((set) => ({
  showAllFiles: false,
  setShowAllFiles: (showAllFiles) => set(() => ({ showAllFiles })),
}));

export default useFileStore;
