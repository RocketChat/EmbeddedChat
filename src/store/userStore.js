import create from 'zustand';

const useUserStore = create((set) => ({
  user: {},
  isUserAuthenticated: false,
  setUser: (user) => set(() => ({ user: user })),
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated: isUserAuthenticated })),
}));

export default useUserStore;
