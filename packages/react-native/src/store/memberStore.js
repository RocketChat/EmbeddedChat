import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  toggleShowMembers: () =>
    set((state) => ({ showMembers: !state.showMembers })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
