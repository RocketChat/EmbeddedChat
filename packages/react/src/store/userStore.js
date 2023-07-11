import create from 'zustand';
import {
  RC_LOCAL_USER_AVATAR_URL,
  RC_LOCAL_USER_ID,
  RC_LOCAL_USER_NAME,
  RC_LOCAL_NAME,
} from '../lib/constant';

const useUserStore = create((set) => ({
  userId: localStorage.getItem(RC_LOCAL_USER_ID) || '',
  setUserId: (userId) => {
    localStorage.setItem(RC_LOCAL_USER_ID, userId);
    set({ userId });
  },
  name: localStorage.getItem(RC_LOCAL_NAME) || '',
  setName: (name) => {
    localStorage.setItem(RC_LOCAL_NAME, name);
    set({ name });
  },
  username: localStorage.getItem(RC_LOCAL_USER_NAME) || '',
  setUsername: (username) => {
    localStorage.setItem(RC_LOCAL_USER_NAME, username);
    set({ username });
  },
  avatarUrl: localStorage.getItem(RC_LOCAL_USER_AVATAR_URL) || '',
  setUserAvatarUrl: (avatarUrl) =>
    set(() => {
      localStorage.setItem(RC_LOCAL_USER_AVATAR_URL, avatarUrl);
      return {
        avatarUrl,
      };
    }),
  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated })),
  password: null,
  setPassword: (password) => set(() => ({ password })),
  emailoruser: null,
  setEmailorUser: (emailoruser) => set(() => ({ emailoruser })),
  showAvatar: false,
  setShowAvatar: (showAvatar) => set(() => ({ showAvatar })),
  roles: {},
  setRoles: (roles) => set((state) => ({ ...state, roles })),
}));

export default useUserStore;
