/* eslint-disable no-shadow */
import { useDebouncedCallback } from '@rocket.chat/fuselage-hooks';
import useUiKitActionManager from './useUiKitActionManager';

export const useModalContextValue = ({ view, values, updateValues }) => {
  const { emitInteraction } = useUiKitActionManager();

  const debouncedTriggerAction = useDebouncedCallback(async (appId, params) => {
    await emitInteraction(appId, params);
  }, 700);

  return {
    action: async ({
      actionId,
      viewId,
      appId,
      dispatchActionConfig,
      blockId,
      value,
    }) => {
      if (!appId || !viewId) {
        return;
      }

      const emit = dispatchActionConfig?.includes('on_character_entered')
        ? debouncedTriggerAction
        : async (appId, params) => {
            await emitInteraction(appId, params);
          };

      await emit(appId, {
        type: 'blockAction',
        actionId,
        container: {
          type: 'view',
          id: viewId,
        },
        payload: {
          blockId,
          value,
        },
      });
    },
    updateState: ({ actionId, value, blockId = 'default' }) => {
      updateValues({
        actionId,
        payload: {
          blockId,
          value,
        },
      });
    },
    ...view,
    values,
    viewId: view.id,
  };
};
