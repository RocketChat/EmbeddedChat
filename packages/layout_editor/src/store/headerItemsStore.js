import { create } from 'zustand';

const useHeaderItemsStore = create((set) => ({
  surfaceItems: ['minmax', 'close', 'thread', 'mentions', 'starred', 'pinned'],
  menuItems: ['files', 'members', 'search', 'rInfo', 'logout'],
  setSurfaceItems: (items) => set({ surfaceItems: items }),
  setMenuItems: (items) => set({ menuItems: items }),
}));

export default useHeaderItemsStore;
