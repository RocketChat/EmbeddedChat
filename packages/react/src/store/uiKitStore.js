import { create } from 'zustand';

const useUiKitStore = create((set) => ({
  isUiKitModalOpen: false,
  setIsUiKitModalOpen: (isOpen) => set({ isUiKitModalOpen: isOpen }),

  isUiKitContextualBarOpen: false,
  setIsUiKitContextualBarOpen: (isOpen) => {
    console.log('Setting isUiKitContextualBarOpen to:', isOpen); // Log the change
    set({ isUiKitContextualBarOpen: isOpen });
  },

  modalViewData: null,
  setModalViewData: (data) => set({ modalViewData: data }),

  contextualBarViewData: null,
  setContextualBarViewData: (data) => {
    console.log('Setting contextualBarViewData to:', data); // Log the change
    set({ contextualBarViewData: data });
  },
}));

export default useUiKitStore;
