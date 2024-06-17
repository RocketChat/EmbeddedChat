import { create } from 'zustand';

const useUserStore = create((set) => ({
  userId: '',
  setUserId: (userId) => {
    set({ userId });
  },
  name: '',
  setName: (name) => {
    set({ name });
  },
  username: '',
  setUsername: (username) => {
    set({ username });
  },
  avatarUrl: '',
  setUserAvatarUrl: (avatarUrl) =>
    set(() => ({
      avatarUrl,
    })),
  isUserAuthenticated: false,
  canSendMsg: true,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated })),
  setCanSendMsg: (canSendMsg) => set(() => ({ canSendMsg })),
  password: null,
  setPassword: (password) => set(() => ({ password })),
  emailoruser: null,
  setEmailorUser: (emailoruser) => set(() => ({ emailoruser })),
  roles: {},
  setRoles: (roles) => set((state) => ({ ...state, roles })),
  showCurrentUserInfo: false,
  setShowCurrentUserInfo: (showCurrentUserInfo) =>
    set(() => ({ showCurrentUserInfo })),
  currentUser: {},
  setCurrentUser: (currentUser) => set({ currentUser }),
}));

export default useUserStore;
