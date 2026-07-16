import { create } from 'zustand';

const useAiGeneratedBlocksStore = create((set) => ({
  publishedBlocks: [],
  publishedSurface: 'message', // 'message' | 'contextualBar' | 'modal'
  publishedComponentType: 'info', // 'form' | 'profile' | 'gallery' | 'cta' | 'info'
  publishBlocks: (blocks, surface, componentType = 'info') =>
    set({
      publishedBlocks: blocks,
      publishedSurface: surface,
      publishedComponentType: componentType,
    }),
}));

export default useAiGeneratedBlocksStore;
