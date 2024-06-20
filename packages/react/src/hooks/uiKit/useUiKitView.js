/* eslint-disable no-shadow */
import { useSafely } from '@rocket.chat/fuselage-hooks';
import { useMemo, useReducer } from 'react';
import { extractInitialStateFromLayout } from '../../uiKit/utils/extractInitialStateFromLayout';

const reduceValues = (values, { actionId, payload }) => ({
  ...values,
  [actionId]: payload,
});

export function useUiKitView(initialView) {
  const [values, updateValues] = useSafely(
    useReducer(reduceValues, initialView.blocks, extractInitialStateFromLayout)
  );

  const state = useMemo(
    () =>
      Object.entries(values).reduce((obj, [key, payload]) => {
        if (!payload?.blockId) {
          return obj;
        }

        const { blockId, value } = payload;
        obj[blockId] = obj[blockId] || {};
        obj[blockId][key] = value;

        return obj;
      }, {}),
    [values]
  );

  return { values, updateValues, state };
}
