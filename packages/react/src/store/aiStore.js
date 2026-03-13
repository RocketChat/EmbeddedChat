import { create } from 'zustand';

const useAiStore = create((set) => ({
  smartReplies: [],
  setSmartReplies: (replies) => set({ smartReplies: replies }),
  isAiEnabled: false,
  setIsAiEnabled: (enabled) => set({ isAiEnabled: enabled }),
  aiLoading: false,
  setAiLoading: (loading) => set({ aiLoading: loading }),
  isSummaryModalOpen: false,
  setSummaryModalOpen: (open) => set({ isSummaryModalOpen: open }),
  summaryContent: '',
  setSummaryContent: (content) => set({ summaryContent: content }),
}));

export default useAiStore;
