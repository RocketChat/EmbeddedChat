import React from 'react';
import { Surface } from './Surface';
import { Box } from '../../Box';

const ModalSurface = ({ children }) => (
  <Surface type="modal">
    <Box
      style={{
        marginBlock: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {children}
    </Box>
  </Surface>
);

export default ModalSurface;
