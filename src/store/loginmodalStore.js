import create from 'zustand';

const loginModalStore = create((set) => ({
  isLoginModalOpen: true,
  setIsLoginModalOpen: (isLoginModalOpen) => set(() => ({ isLoginModalOpen })),
}));

export default loginModalStore;
