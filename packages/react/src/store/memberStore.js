import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  setShowMembers: (showMembers) => set(() => ({ showMembers })),
  memberRoles: {},
  setMemberRoles: (memberRoles) => set((state) => ({ ...state, memberRoles })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
