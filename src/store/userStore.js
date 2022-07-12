import create from 'zustand';

const useUserStore = create((set) => ({
  isUserAuthenticated: false,
  setIsUserAuthenticated: (isUserAuthenticated) =>
    set(() => ({ isUserAuthenticated: isUserAuthenticated })),
}));

export default useUserStore;
