import create from 'zustand';

const useTotpStore = create((set) => ({
  isModalOpen: false,
  SetisModalOpen: (isModalOpen) => set(() => ({ isModalOpen })),
}));

export default useTotpStore;
