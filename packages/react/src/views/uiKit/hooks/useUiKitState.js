/* eslint-disable no-shadow */
import { useCallback, useContext, useMemo, useState } from 'react';
import { useSafely } from '@rocket.chat/fuselage-hooks';
import * as UiKit from '@rocket.chat/ui-kit';

import { UiKitContext } from '../contexts/UiKitContext';
import { getInitialValue } from '../utils/getInitialValue';

const getElementValueFromState = (actionId, values, initialValue) =>
  (values && (values[actionId]?.value || initialValue)) ?? initialValue;

export const useUiKitState = (element, context) => {
  const { blockId, actionId, appId, dispatchActionConfig } = element;
  const {
    action,
    appId: appIdFromContext = 'core',
    viewId,
    updateState,
    values,
    errors,
  } = useContext(UiKitContext);

  const initialValue = getInitialValue(element);
  const _value = getElementValueFromState(actionId, values, initialValue);
  const error = errors?.[actionId];

  const [value, setValue] = useSafely(useState(_value));
  const [loading, setLoading] = useSafely(useState(false));

  const actionFunction = useCallback(
    async (e) => {
      const {
        target: { value: elValue },
      } = e;
      setLoading(true);

      if (Array.isArray(value)) {
        const idx = value.findIndex((val) => val === elValue);
        if (idx > -1) {
          setValue(value.filter((_, i) => i !== idx));
        } else {
          setValue([...value, elValue]);
        }
      } else {
        setValue(elValue);
      }

      await updateState?.(
        { blockId, appId, actionId, value: elValue, viewId },
        e
      );
      await action(
        {
          blockId,
          appId: appId || appIdFromContext,
          actionId,
          value: elValue,
          viewId,
        },
        e
      );
      setLoading(false);
    },
    [
      value,
      setValue,
      setLoading,
      updateState,
      action,
      blockId,
      appId,
      actionId,
      viewId,
      appIdFromContext,
    ]
  );

  const noLoadStateActionFunction = useCallback(
    async (e) => {
      const {
        target: { value },
      } = e;
      setValue(value);
      updateState &&
        (await updateState({ blockId, appId, actionId, value, viewId }, e));
      await action(
        {
          blockId,
          appId: appId || appIdFromContext,
          actionId,
          value,
          viewId,
          dispatchActionConfig,
        },
        e
      );
    },
    [
      setValue,
      updateState,
      action,
      blockId,
      appId,
      actionId,
      viewId,
      dispatchActionConfig,
      appIdFromContext,
    ]
  );

  const stateFunction = useCallback(
    async (e) => {
      const {
        target: { value },
      } = e;
      setValue(value);
      await updateState?.(
        { blockId, appId: appId || appIdFromContext, actionId, value, viewId },
        e
      );
    },
    [setValue, updateState, blockId, appId, actionId, viewId, appIdFromContext]
  );

  const result = useMemo(
    () => ({ loading, setLoading, error, value }),
    [loading, setLoading, error, value]
  );

  if (
    element.type === 'plain_text_input' &&
    Array.isArray(element.dispatchActionConfig) &&
    element.dispatchActionConfig.includes('on_character_entered')
  ) {
    return [result, noLoadStateActionFunction];
  }

  if (
    (context &&
      [UiKit.BlockContext.SECTION, UiKit.BlockContext.ACTION].includes(
        context
      )) ||
    (Array.isArray(element.dispatchActionConfig) &&
      element.dispatchActionConfig.includes('on_item_selected'))
  ) {
    return [result, actionFunction];
  }

  return [result, stateFunction];
};
