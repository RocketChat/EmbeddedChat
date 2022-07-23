import create from 'zustand';

const useUserStore = create((set) => ({
  avatarUrl: localStorage.getItem('avatarUrl') || '',
  setUserAvatarUrl: (avatarUrl) =>
    set(() => {
      localStorage.setItem('avatarUrl', avatarUrl);
      return {
        avatarUrl,
      };
    }),
  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated: isUserAuthenticated })),
}));

export default useUserStore;
