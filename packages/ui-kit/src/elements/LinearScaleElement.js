import * as UiKit from '@rocket.chat/ui-kit';
import React, { memo, useMemo } from 'react';
import { css } from '@emotion/react';
import { Box, Button } from '@embeddedchat/ui-elements';
import { LinearScaleElementStyles as styles } from './elements.styles';

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
    <Box css={styles.parentContainer}>
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
        <Box className={className} css={styles.childContainer}>
          {points.map((point, i) => (
            <Button
              key={i}
              className={point === String(value) ? 'active' : undefined}
              disabled={loading}
              size="small"
              color={error ? 'error' : 'secondary'}
              css={css`
                margin-inline: 0.25rem;
                flex-shrink: 1;
              `}
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
