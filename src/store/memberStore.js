import create from 'zustand';

const useMemberStore = create((set) => ({
  members: [],
  showMembers: false,
  showMembersHandler: (filter) => set(() => ({ showMembers: filter })),
  setMembersHandler: (memberList) => set(() => ({ members: memberList })),
}));

export default useMemberStore;
