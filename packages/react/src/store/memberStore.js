import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  setShowMembers: (showMembers) => set(() => ({ showMembers })),
  memberRoles: {},
  admins: [],
  setMemberRoles: (memberRoles) => set((state) => ({ ...state, memberRoles })),
  setAdmins: (admins) => set(() => ({ admins })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
