import { create } from 'zustand';

const totpModalStore = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set(() => ({ isModalOpen })),
}));

export default totpModalStore;
