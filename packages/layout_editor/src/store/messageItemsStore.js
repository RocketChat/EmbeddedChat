import { create } from 'zustand';

const useMessageItemsStore = create((set) => ({
  surfaceItems: [
    'reaction',
    'reply',
    'quote',
    'star',
    'pin',
    'edit',
    'delete',
    'report',
  ],

  menuItems: [],
  setSurfaceItems: (items) => set({ surfaceItems: items }),
  setMenuItems: (items) => set({ menuItems: items }),
}));

export default useMessageItemsStore;
