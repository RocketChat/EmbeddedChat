import React from 'react';
import { Box } from '../../../Box';
import { ContextElementItem } from './ContextElementItem';

export const ContextElement = ({ block, surfaceRenderer, className }) => (
  <Box
    className={className}
    display="flex"
    style={{
      display: 'flex',
      alignItems: 'center',
      margin: '-1rem',
      textOverflow: 'ellipsis',
    }}
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
