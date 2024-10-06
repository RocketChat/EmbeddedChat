import { create } from 'zustand';

const useUiKitStore = create((set) => ({
  uiKitModalOpen: false,
  setUiKitModalOpen: (isOpen) => set({ uiKitModalOpen: isOpen }),

  uiKitContextualBarOpen: false,
  setUiKitContextualBarOpen: (isOpen) =>
    set({ uiKitContextualBarOpen: isOpen }),

  uiKitModalData: null,
  setUiKitModalData: (data) => set({ uiKitModalData: data }),

  uiKitContextualBarData: null,
  setUiKitContextualBarData: (data) => set({ uiKitContextualBarData: data }),
}));

export default useUiKitStore;
