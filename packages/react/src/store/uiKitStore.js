import { create } from 'zustand';

const useUiKitStore = create((set) => ({
  isUiKitModalOpen: false,
  setIsUiKitModalOpen: (isOpen) => set({ isUiKitModalOpen: isOpen }),

  isUiKitContextualBarOpen: false,
  setIsUiKitContextualBarOpen: (isOpen) => {
    set({ isUiKitContextualBarOpen: isOpen });
  },

  modalViewData: null,
  setModalViewData: (data) => set({ modalViewData: data }),

  contextualBarViewData: null,
  setContextualBarViewData: (data) => {
    set({ contextualBarViewData: data });
  },
}));

export default useUiKitStore;
