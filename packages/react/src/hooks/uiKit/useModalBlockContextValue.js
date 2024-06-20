import { useDebouncedCallback } from '@rocket.chat/fuselage-hooks';
import { useContext } from 'react';
import RCContext from '../../context/RCInstance';

export const useModalContextValue = ({
  view,
  values,
  updateValues,
  mid,
  rid,
}) => {
  const { RCInstance } = useContext(RCContext);

  const debouncedTriggerBlockAction = useDebouncedCallback(async (params) => {
    await RCInstance?.triggerBlockAction(params);
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

      const triggerAction = dispatchActionConfig?.includes(
        'on_character_entered'
      )
        ? debouncedTriggerBlockAction
        : async (params) => {
            await RCInstance?.triggerBlockAction(params);
          };

      await triggerAction({
        appId,
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
