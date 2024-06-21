import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../../components/Box';
import { Surface } from './Surface';

const ContextualBarSurface = ({ children }) => (
  <Surface type="contextualBar">
    <Box
      css={css`
        margin-block: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      `}
    >
      {children}
    </Box>
  </Surface>
);

export default ContextualBarSurface;
