import { create } from 'zustand';

const useAuthStore = create((set) => ({
  userId: '',
  setUserId: (userId) => set({ userId }),

  name: '',
  setName: (name) => set({ name }),

  username: '',
  setUsername: (username) => set({ username }),

  avatarUrl: '',
  setUserAvatarUrl: (avatarUrl) => set({ avatarUrl }),

  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) => set({ isUserAuthenticated }),

  canSendMsg: true,
  setCanSendMsg: (canSendMsg) => set({ canSendMsg }),

  password: null,
  setPassword: (password) => set({ password }),

  emailoruser: null,
  setEmailorUser: (emailoruser) => set({ emailoruser }),

  roles: [],
  setRoles: (roles) => set({ roles }),

  userPinPermissions: {},
  setUserPinPermissions: (userPinPermissions) => set({ userPinPermissions }),

  viewUserInfoPermissions: {},
  setViewUserInfoPermissions: (viewUserInfoPermissions) =>
    set({ viewUserInfoPermissions }),

  showCurrentUserInfo: false,
  setShowCurrentUserInfo: (showCurrentUserInfo) => set({ showCurrentUserInfo }),

  currentUser: {},
  setCurrentUser: (currentUser) => set({ currentUser }),

  isLoginIn: false,
  setIsLoginIn: (isLoginIn) => set({ isLoginIn }),

  isLoginModalOpen: false,
  setIsLoginModalOpen: (isLoginModalOpen) => set({ isLoginModalOpen }),

  isTotpModalOpen: false,
  setIsTotpModalOpen: (isTotpModalOpen) => set({ isTotpModalOpen }),
}));

export default useAuthStore;

