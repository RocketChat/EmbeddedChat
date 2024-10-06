import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { Surface } from './Surface';

const ModalSurface = ({ children }) => (
  <Surface type="modal">
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

export default ModalSurface;
