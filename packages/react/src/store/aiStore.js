import { create } from 'zustand';

const useAiStore = create((set) => ({
  // Catch-ups deliberately live only in the widget state. They must never be
  // sent through Rocket.Chat, otherwise a private AI result becomes visible to
  // everyone in the room.
  channelCatchUps: [],
  threadCatchUps: [],
  isCatchUpProcessing: false,
  setCatchUpProcessing: (isCatchUpProcessing) =>
    set(() => ({ isCatchUpProcessing })),
  addCatchUp: ({ text, threadId = null }) =>
    set((state) => {
      const catchUp = {
        id: `ai-catch-up-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        createdAt: new Date().toISOString(),
        threadId,
      };
      return threadId
        ? {
            threadCatchUps: [
              ...state.threadCatchUps.filter(
                (existingCatchUp) => existingCatchUp.threadId !== threadId
              ),
              catchUp,
            ],
          }
        : { channelCatchUps: [catchUp] };
    }),
  dismissCatchUp: (id, threadId = null) =>
    set((state) =>
      threadId
        ? {
            threadCatchUps: state.threadCatchUps.filter(
              (catchUp) => catchUp.id !== id
            ),
          }
        : {
            channelCatchUps: state.channelCatchUps.filter(
              (catchUp) => catchUp.id !== id
            ),
          }
    ),
}));

export default useAiStore;
