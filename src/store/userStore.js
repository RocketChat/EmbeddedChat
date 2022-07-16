import create from 'zustand';

const useUserStore = create((set) => ({
  user: {},
  setUser: (user) => set(() => ({ user })),
  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated: isUserAuthenticated })),
}));

export default useUserStore;
