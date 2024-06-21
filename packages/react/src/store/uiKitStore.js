import { create } from 'zustand';

const useUiKitStore = create((set) => ({
  isUiKitModalOpen: false,
  setIsUiKitModalOpen: (isOpen) => set({ isUiKitModalOpen: isOpen }),

  viewData: null,
  setViewData: (data) => set({ viewData: data }),
}));

export default useUiKitStore;
