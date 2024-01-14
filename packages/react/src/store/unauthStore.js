import { create } from 'zustand';

const unAuthStore = create((set) => ({
  isUnauthorizedAttempt: false,
  setIsUnauthorizedAttempt: (isUnauthorizedAttempt) => set(() => ({ isUnauthorizedAttempt })),
}));

export default unAuthStore;
