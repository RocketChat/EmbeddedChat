import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  memberRoles: {},
  setMemberRoles: (memberRoles) => set((state) => ({ ...state, memberRoles })),
  toggleShowMembers: () =>
    set((state) => ({ showMembers: !state.showMembers })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
