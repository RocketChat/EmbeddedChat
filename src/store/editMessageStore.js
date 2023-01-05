import create from 'zustand';

const useEditMessageStore = create((set) => ({
    editMessage: {},
    setEditMessage: (editMessage) => set(() => ({ editMessage }))
}));

export default useEditMessageStore;
