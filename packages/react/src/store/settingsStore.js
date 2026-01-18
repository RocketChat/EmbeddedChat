import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  messageLimit: null, // Will be fetched from RC server (Message_MaxAllowedSize)
  setMessageLimit: (messageLimit) => set(() => ({ messageLimit })),
}));

export default useSettingsStore;
