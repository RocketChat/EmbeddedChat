import { create } from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  isChannelPrivate: false,
  isChannelReadOnly: false,
  isChannelArchived: false,
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
  setIsChannelPrivate: (isChannelPrivate) => set(() => ({ isChannelPrivate })),
  setIsChannelArchived: (isChannelArchived) =>
    set(() => ({ isChannelArchived })),
  setIsChannelReadOnly: (isChannelReadOnly) =>
    set(() => ({ isChannelReadOnly })),
}));

export default useChannelStore;
