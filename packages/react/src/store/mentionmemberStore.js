import { create } from 'zustand';

const mentionmemberStore = create((set) => ({
  roomMembers: {},
  showMembersList: false,
  toggleShowMembers: (showMembersList) => set({ showMembersList }),
  setRoomMembers: (roomMembers) => set({ roomMembers }),
}));

export default mentionmemberStore;
