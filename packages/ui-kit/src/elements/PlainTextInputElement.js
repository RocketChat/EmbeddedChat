import React, { memo } from 'react';
import { Input } from '@embeddedchat/ui-elements';
import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const PlainTextInputElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading, value = '', error }, action] = useUiKitState(
    block,
    context
  );

  if (block.multiline) {
    return (
      <Input
        textArea
        disabled={loading}
        id={block.actionId}
        name={block.actionId}
        rows={6}
        error={error}
        value={value}
        onChange={action}
        placeholder={
          block.placeholder
            ? fromTextObjectToString(surfaceRenderer, block.placeholder, 0)
            : undefined
        }
      />
    );
  }

  return (
    <Input
      disabled={loading}
      id={block.actionId}
      name={block.actionId}
      error={error}
      value={value}
      onChange={action}
      placeholder={
        block.placeholder
          ? fromTextObjectToString(surfaceRenderer, block.placeholder, 0)
          : undefined
      }
    />
  );
};

export default memo(PlainTextInputElement);
