import { create } from 'zustand';

const useAiStore = create((set) => ({
  isAiTyping: false,
  setIsAiTyping: (isAiTyping) => set(() => ({ isAiTyping })),

  threadSummary: '',
  showThreadSummary: false,
  setThreadSummary: (threadSummary) =>
    set(() => ({ threadSummary, showThreadSummary: true })),
  closeThreadSummary: () =>
    set(() => ({ showThreadSummary: false, threadSummary: '' })),
}));

export default useAiStore;
