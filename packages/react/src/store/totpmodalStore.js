import { create } from 'zustand';

const totpModalStore = create((set) => ({
  isTotpModalOpen: false,
  setIsTotpModalOpen: (isTotpModalOpen) => set(() => ({ isTotpModalOpen })),
}));

export default totpModalStore;
