import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  messageLimit: 5000,
  setMessageLimit: (messageLimit) => set(() => ({ messageLimit })),
}));

export default useSettingsStore;
