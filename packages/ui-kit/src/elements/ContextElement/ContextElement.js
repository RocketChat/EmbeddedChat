import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { ContextElementItem } from './ContextElementItem';

export const ContextElement = ({ block, surfaceRenderer, className }) => (
  <Box
    className={className}
    display="flex"
    css={css`
      display: flex,
      align-items: center,
      margin: -1rem,
      text-overflow: ellipsis,
    `}
  >
    {block.elements.map((element, i) => (
      <ContextElementItem
        index={i}
        key={i}
        element={element}
        surfaceRenderer={surfaceRenderer}
      />
    ))}
  </Box>
);
