import { create } from 'zustand';

const DEFAULT_MESSAGE_LIMIT = 5000;

const useSettingsStore = create((set) => ({
  messageLimit: DEFAULT_MESSAGE_LIMIT,
  setMessageLimit: (messageLimit) =>
    set(() => ({
      messageLimit:
        typeof messageLimit === 'number' && Number.isFinite(messageLimit)
          ? messageLimit
          : DEFAULT_MESSAGE_LIMIT,
    })),
}));

export default useSettingsStore;
