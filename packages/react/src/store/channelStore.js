import { create } from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  isChannelPrivate: false,
  memberRoles: {},
  setMemberRoles: (memberRoles) => set((state) => ({ ...state, memberRoles })),
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
  setIsChannelPrivate: (isChannelPrivate) => set(() => ({ isChannelPrivate })),
}));

export default useChannelStore;
