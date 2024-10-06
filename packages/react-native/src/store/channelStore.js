import { create } from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
}));

export default useChannelStore;
