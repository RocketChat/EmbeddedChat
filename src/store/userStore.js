import create from 'zustand';

const useUserStore = create((set) => ({
  username: localStorage.getItem('rc_uname') || '',
  setUsername: (username) => {
    localStorage.setItem('rc_uname', username);
    set({ username });
  },
  avatarUrl: localStorage.getItem('rc_avatar_url') || '',
  setUserAvatarUrl: (avatarUrl) =>
    set(() => {
      localStorage.setItem('rc_avatar_url', avatarUrl);
      return {
        avatarUrl,
      };
    }),
  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated })),
}));

export default useUserStore;
