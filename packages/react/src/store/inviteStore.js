import { create } from 'zustand';

const useInviteStore = create((set) => ({
  showInvite: false,
  toggleInviteView: () => set((state) => ({ showInvite: !state.showInvite })),
}));

export default useInviteStore;
