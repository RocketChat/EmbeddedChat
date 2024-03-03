import { create } from 'zustand';

const useUserInfoStore = create((set) => ({
  showUserInfo: false,
  setShowUserInfo: (showUserInfo) => set(() => ({ showUserInfo })),
  userInfo: {},
  setUserInfo: (userInfo) => set(() => ({ userInfo })),
}));

export default useUserInfoStore;
