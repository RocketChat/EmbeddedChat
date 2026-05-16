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
  // SECURITY FIX (Issue #1263): Removed password storage from global state
  // Passwords should never be stored in client-side state (CWE-312)
  // TOTP flow now uses component-level state instead
  emailoruser: null,
  setEmailorUser: (emailoruser) => set(() => ({ emailoruser })),
  roles: [],
  setRoles: (roles) => set((state) => ({ ...state, roles })),
  userPinPermissions: {},
  setUserPinPermissions: (userPinPermissions) =>
    set((state) => ({ ...state, userPinPermissions })),
  viewUserInfoPermissions: {},
  setViewUserInfoPermissions: (viewUserInfoPermissions) =>
    set((state) => ({ ...state, viewUserInfoPermissions })),
  showCurrentUserInfo: false,
  setShowCurrentUserInfo: (showCurrentUserInfo) =>
    set(() => ({ showCurrentUserInfo })),
  currentUser: {},
  setCurrentUser: (currentUser) => set({ currentUser }),
}));

export default useUserStore;
