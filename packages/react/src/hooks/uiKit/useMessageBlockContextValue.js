import useUiKitActionManager from './useUiKitActionManager';

export const useMessageBlockContextValue = (rid, mid) => {
  const { emitInteraction } = useUiKitActionManager();
  return {
    action: async ({ appId, actionId, blockId, value }) => {
      await emitInteraction(appId, {
        type: 'blockAction',
        actionId,
        payload: {
          blockId,
          value,
        },
        container: {
          type: 'message',
          id: mid,
        },
        rid,
        mid,
      });
    },
    rid,
    values: {},
  };
};
