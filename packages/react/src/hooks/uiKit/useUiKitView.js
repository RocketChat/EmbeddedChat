/* eslint-disable no-shadow */
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useSafely } from '@rocket.chat/fuselage-hooks';
import { extractInitialStateFromLayout } from '@embeddedchat/ui-kit';
import useUiKitActionManager from './useUiKitActionManager';

const reduceValues = (values, { actionId, payload }) => ({
  ...values,
  [actionId]: payload,
});

const getViewId = (view) => {
  if ('id' in view && typeof view.id === 'string') {
    return view.id;
  }

  if ('viewId' in view && typeof view.viewId === 'string') {
    return view.viewId;
  }

  throw new Error('Invalid view');
};

const getViewFromInteraction = (interaction) => {
  if ('view' in interaction && typeof interaction.view === 'object') {
    return interaction.view;
  }

  if (interaction.type === 'banner.open') {
    return interaction;
  }

  return undefined;
};

function useUiKitView(initialView) {
  const [errors, setErrors] = useSafely(useState(undefined));
  const [values, updateValues] = useSafely(
    useReducer(reduceValues, initialView.blocks, extractInitialStateFromLayout)
  );
  const [view, updateView] = useSafely(useState(initialView));
  const actionManager = useUiKitActionManager();

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

  const viewId = getViewId(view);

  useEffect(() => {
    const handleUpdate = (interaction) => {
      if (interaction.type === 'errors') {
        setErrors(interaction.errors);
        return;
      }

      updateView((view) => ({
        ...view,
        ...getViewFromInteraction(interaction),
      }));
    };

    actionManager.on(viewId, handleUpdate);

    return () => {
      actionManager.off(viewId, handleUpdate);
    };
  }, [actionManager, setErrors, updateView, viewId]);

  return { view, errors, values, updateValues, state };
}

export default useUiKitView;
