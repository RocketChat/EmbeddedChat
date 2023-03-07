import create from 'zustand';

const usePruneStore = create((set) => ({
  open: false,
  data: null,
  toggle: () => {
    set((state) => ({ open: !state.open }));
  },
}));

export default usePruneStore;
