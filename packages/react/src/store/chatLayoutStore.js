import { create } from 'zustand';

const initialPanelsState = {
  showMembers: false,
  showSearch: false,
  showPinned: false,
  showStarred: false,
  showAllThreads: false,
  showAllFiles: false,
  showMentions: false,
  showCurrentUserInfo: false,
  showChannelinfo: false,
};

const useChatLayoutStore = create((set, get) => ({
  showSidebar: false,
  setShowSidebar: (showSidebar) => set({ showSidebar }),

  ...initialPanelsState,

  setPanelState: (panelKey, isOpen) => {
    if (!(panelKey in initialPanelsState)) return;
    set({ [panelKey]: Boolean(isOpen) });
  },

  closeAllPanels: () => set({ ...initialPanelsState, showSidebar: false }),

  openExclusivePanel: (panelKey) => {
    if (!panelKey) {
      return set({ ...initialPanelsState, showSidebar: false });
    }
    if (!(panelKey in initialPanelsState)) return;

    const nextPanels = Object.keys(initialPanelsState).reduce((acc, key) => {
      acc[key] = key === panelKey;
      return acc;
    }, {});

    set({ ...nextPanels, showSidebar: true });
  },

  getOpenPanelKey: () => {
    const state = get();
    const openKey = Object.keys(initialPanelsState).find((key) => state[key]);
    return openKey || null;
  },
}));

export default useChatLayoutStore;

