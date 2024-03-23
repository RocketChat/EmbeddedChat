import React from 'react';
import { Box } from '../../Box';

const Backdrop = ({ children, onClick }) => (
  <Box
    onClick={onClick}
    style={{
      position: 'fixed',
      zIndex: 10000,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: '#6c6c6cb3',
      display: 'flex',
    }}
  >
    {children}
  </Box>
);

export default Backdrop;
