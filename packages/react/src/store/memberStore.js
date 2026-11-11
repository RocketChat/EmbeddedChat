import { create } from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  setShowMembers: (showMembers) => set(() => ({ showMembers })),
  memberRoles: {},
  admins: [],
  moderators: [],
  owners: [],
  setMemberRoles: (memberRoles) => set((state) => ({ ...state, memberRoles })),
  setAdmins: (admins) => set(() => ({ admins })),
  setModerators: (moderators) => set(() => ({ moderators })),
  setOwners: (owners) => set(() => ({ owners })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
