import create from 'zustand';

const loginModalStore = create((set) => ({
  isLoginModalOpen: false,
  setIsLoginModalOpen: (isLoginModalOpen) => set(() => ({ isLoginModalOpen })),
}));

export default loginModalStore;
