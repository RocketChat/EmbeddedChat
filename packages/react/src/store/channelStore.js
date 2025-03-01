import { create } from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  isChannelPrivate: false,
  isChannelReadOnly: false,
  isRoomTeam: false,
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
  setIsChannelPrivate: (isChannelPrivate) => set(() => ({ isChannelPrivate })),
  setIsRoomTeam: (isRoomTeam) => set(() => ({ isRoomTeam })),
  setIsChannelReadOnly: (isChannelReadOnly) =>
    set(() => ({ isChannelReadOnly })),
}));

export default useChannelStore;
