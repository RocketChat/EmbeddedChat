import create from 'zustand';

const useRolesStore = create((set) => ({
  roles: {},
  setRoles: (roles) => set((state) => ({ ...state, roles })),
}));

export default useRolesStore;
