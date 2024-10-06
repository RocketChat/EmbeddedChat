import { create } from 'zustand';

const useLoginStore = create((set) => ({
  isLoginIn: false,
  setIsLoginIn: (isLoginIn) => set(() => ({ isLoginIn })),
  isLoginModalOpen: false,
  setIsLoginModalOpen: (isLoginModalOpen) => set(() => ({ isLoginModalOpen })),
}));

export default useLoginStore;
