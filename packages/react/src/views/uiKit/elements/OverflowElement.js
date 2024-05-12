import React, { useMemo, memo } from 'react';
import { css } from '@emotion/react';
import { Menu } from '../../../components/Menu';
import { Box } from '../../../components/Box';
import { useUiKitState } from '../hooks/useUiKitState';
import { fromTextObjectToString } from '../utils/fromTextObjectToString';

const OverflowElement = ({ block, context, surfaceRenderer }) => {
  const [{ loading }, action] = useUiKitState(block, context);

  const options = useMemo(
    () =>
      block.options.map(({ value, text, url }, i) => ({
        id: value,
        label: fromTextObjectToString(surfaceRenderer, text, i) ?? '',
        icon: undefined,
        action: () => {
          if (url) {
            window.open(url);
          }
          action({ target: { value: String(value) } });
        },
      })),
    [action, block.options, surfaceRenderer]
  );

  return (
    <Box
      css={css`
        text-align: right;
        position: absolute;
        right: 0;
        top: 0;
      `}
    >
      <Menu
        options={options}
        isToolTip={false}
        css={css`
          padding: 0 0.25rem;
        `}
      />
    </Box>
  );
};

export default memo(OverflowElement);
