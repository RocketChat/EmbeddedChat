import * as UiKit from '@rocket.chat/ui-kit';
import React, { memo, useMemo } from 'react';
import { Box } from '../../Box';
import { Button } from '../../Button';

import { useUiKitState } from '../hooks/useUiKitState';

const LinearScaleElement = ({ className, block, context, surfaceRenderer }) => {
  const {
    minValue = 0,
    maxValue = 10,
    initialValue,
    preLabel,
    postLabel,
  } = block;

  const [{ loading, value = initialValue, error }, action] = useUiKitState(
    block,
    context
  );

  const points = useMemo(
    () =>
      Array.from({ length: Math.max(maxValue - minValue + 1, 1) }, (_, i) =>
        String(minValue + i)
      ),
    [maxValue, minValue]
  );

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
      }}
    >
      {preLabel && (
        <Box fontScale="c2" paddingInlineEnd={8} textAlign="start">
          {surfaceRenderer.renderTextObject(
            preLabel,
            0,
            UiKit.BlockContext.NONE
          )}
        </Box>
      )}
      <Box>
        <Box
          className={className}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginInline: '-0.25rem',
            minWidth: 0,
          }}
        >
          {points.map((point, i) => (
            <Button
              key={i}
              className={point === String(value) ? 'active' : undefined}
              disabled={loading}
              size="small"
              color={error ? 'error' : 'secondary'}
              style={{
                marginInline: '0.25rem',
                flexShrink: 1,
              }}
              value={point}
              onClick={action}
            >
              {surfaceRenderer.renderTextObject(
                {
                  type: 'plain_text',
                  text: String(i + minValue),
                },
                0,
                UiKit.BlockContext.NONE
              )}
            </Button>
          ))}
        </Box>
      </Box>
      {postLabel && (
        <Box fontScale="c2" paddingInlineStart={8} textAlign="end">
          {surfaceRenderer.renderTextObject(
            postLabel,
            0,
            UiKit.BlockContext.NONE
          )}
        </Box>
      )}
    </Box>
  );
};

export default memo(LinearScaleElement);
