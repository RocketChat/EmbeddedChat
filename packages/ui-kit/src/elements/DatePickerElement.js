import React from 'react';
import { Input } from '@embeddedchat/ui-elements';
import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const DatePickerElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading, value, error }, action] = useUiKitState(block, context);
  const { actionId, placeholder } = block;

  return (
    <Input
      type="date"
      error={error}
      value={value}
      disabled={loading}
      id={actionId}
      name={actionId}
      rows={6}
      placeholder={
        placeholder
          ? fromTextObjectToString(surfaceRenderer, placeholder, 0)
          : undefined
      }
      onInput={action}
    />
  );
};

export default DatePickerElement;
