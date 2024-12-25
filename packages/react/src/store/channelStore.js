import { create } from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  editRoomInfoPermission: [],
  isChannelPrivate: false,
  isChannelReadOnly: false,
  setEditRoomInfoPermission: (editRoomInfoPermission) =>
    set(() => ({ editRoomInfoPermission })),
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
  setIsChannelPrivate: (isChannelPrivate) => set(() => ({ isChannelPrivate })),
  setIsChannelReadOnly: (isChannelReadOnly) =>
    set(() => ({ isChannelReadOnly })),
}));

export default useChannelStore;
