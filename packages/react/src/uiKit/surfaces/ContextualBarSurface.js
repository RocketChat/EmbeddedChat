import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { Surface } from './Surface';

const ContextualBarSurface = ({ children }) => (
  <Surface type="contextualBar">
    <Box
      css={css`
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
