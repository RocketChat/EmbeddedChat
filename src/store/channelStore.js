import create from 'zustand';

const useChannelStore = create((set) => ({
  showChannelinfo: false,
  showEditChannel: false,
  setShowChannelinfo: (showChannelinfo) => set(() => ({ showChannelinfo })),
  toggleEditChannel: () =>
    set((state) => ({ showEditChannel: !state.showEditChannel })),
  channelInfo: {},
  setChannelInfo: (channelInfo) => set(() => ({ channelInfo })),
}));

export default useChannelStore;
