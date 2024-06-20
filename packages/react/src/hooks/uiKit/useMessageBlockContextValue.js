import { useContext } from 'react';
import RCContext from '../../context/RCInstance';

export const useMessageBlockContextValue = (rid, mid) => {
  const { RCInstance } = useContext(RCContext);

  return {
    action: async ({ appId, actionId, blockId, value }) => {
      await RCInstance?.triggerBlockAction({
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
    rid,
    values: {},
  };
};
