import create from 'zustand';
import {
  RC_LOCAL_USER_AVATAR_URL,
  RC_LOCAL_USER_ID,
  RC_LOCAL_USER_NAME,
} from '../lib/constant';

const useUserStore = create((set) => ({
  userId: localStorage.getItem(RC_LOCAL_USER_ID) || '',
  setUserId: (userId) => {
    localStorage.setItem(RC_LOCAL_USER_ID, userId);
    set({ userId });
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
  showAvatar: false,
  setShowAvatar: (showAvatar) => set(() => ({ showAvatar })),
}));

export default useUserStore;
