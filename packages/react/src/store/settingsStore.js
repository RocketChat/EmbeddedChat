import { create } from 'zustand';

const DEFAULT_MESSAGE_LIMIT = 5000;

const useSettingsStore = create((set) => ({
  // Default fallback value; will be overridden from RC server (Message_MaxAllowedSize) when available
  messageLimit: DEFAULT_MESSAGE_LIMIT,
  setMessageLimit: (messageLimit) =>
    set(() => ({
      // If server does not return a valid value, keep using the fallback
      messageLimit:
        typeof messageLimit === 'number' && Number.isFinite(messageLimit)
          ? messageLimit
          : DEFAULT_MESSAGE_LIMIT,
    })),
}));

export default useSettingsStore;
