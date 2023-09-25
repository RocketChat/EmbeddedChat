import { create } from "zustand";

const useUserStore = create((set) => ({
	userId: "",
	setUserId: (userId) => set({ userId }),

	name: "",
	setName: (name) => set({ name }),

	username: "",
  setUsername: (username) => set({ username }),

	avatarUrl: "",
  setUserAvatarUrl: (avatarUrl) => set(() => ({ avatarUrl })),

	isUserAuthenticated: false,
	setIsUserAuthenticated: (isUserAuthenticated) => set(() => ({ isUserAuthenticated })),

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
