import { create } from 'zustand';

const useToastStore = create((set) => ({
  position: 'top-start',
  setPosition: (position) => set(() => ({ position })),
}));

export default useToastStore;
