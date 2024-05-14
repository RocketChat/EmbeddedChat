import { useTheme } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import React, { memo, useMemo } from 'react';
import { Box } from '../../../components/Box';

import { useUiKitState } from '../hooks/useUiKitState';

const InputBlock = ({ className, block, surfaceRenderer, context }) => {
  const theme = useTheme();
  const inputElement = useMemo(
    () => ({
      ...block.element,
      appId: block.element.appId ?? block.appId,
      blockId: block.element.blockId ?? block.blockId,
    }),
    [block.element, block.appId, block.blockId]
  );

  const [{ error }] = useUiKitState(inputElement, context);

  return (
    <Box
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}
    >
      {block.label && (
        <Box>
          {surfaceRenderer.renderTextObject(
            block.label,
            0,
            UiKit.BlockContext.NONE
          )}
        </Box>
      )}
      <Box style={{ display: 'flex' }}>
        {surfaceRenderer.renderInputBlockElement(inputElement, 0)}
      </Box>
      {error && (
        <Box style={{ color: theme.palette?.error?.main || 'red' }}>
          {error}
        </Box>
      )}
      {block.hint && (
        <Box style={{ color: theme.palette?.info?.main || 'black' }}>
          {block.hint}
        </Box>
      )}
    </Box>
  );
};

export default memo(InputBlock);
