import { create } from 'zustand';

const useAiGeneratedBlocksStore = create((set) => ({
  publishedConfiguration: null,
  publishConfiguration: (publishedConfiguration) =>
    set({ publishedConfiguration }),
}));

export default useAiGeneratedBlocksStore;
