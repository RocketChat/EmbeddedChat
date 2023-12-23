import React from 'react';
import * as UiKit from '@rocket.chat/ui-kit';
import { Button } from '../../Button';
import { Throbber } from '../../Throbber';

import { useUiKitState } from '../hooks/useUiKitState';

const ButtonElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading }, action] = useUiKitState(block, context);

  if (block.url) {
    return (
      <a target="_blank" href={block.url} rel="noreferrer">
        <Button
          disabled={loading}
          color={block.style === 'danger' ? 'error' : 'secondary'}
          style={{ minWidth: '4ch' }}
          size="small"
          onClick={action}
        >
          {loading ? (
            <Throbber />
          ) : (
            surfaceRenderer.renderTextObject(
              block.text,
              0,
              UiKit.BlockContext.NONE
            )
          )}
        </Button>
      </a>
    );
  }

  return (
    <Button
      disabled={loading}
      primary={block.style === 'primary'}
      danger={block.style === 'danger'}
      minWidth="4ch"
      size='medium'
      value={block.value}
      onClick={action}
    >
      {loading ? (
        <Throbber />
      ) : (
        surfaceRenderer.renderTextObject(block.text, 0, UiKit.BlockContext.NONE)
      )}
    </Button>
  );
};

export default ButtonElement;
