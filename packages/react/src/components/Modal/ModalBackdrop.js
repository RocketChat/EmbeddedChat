import React, { forwardRef } from 'react';
import { Box } from '../Box';

export const ModalBackdrop = forwardRef(({ children, onClick = () => { } }, ref) => {
  return (
    <Box
      ref={ref}
      onClick={onClick}
      style={{
        position: 'fixed',
        zIndex: 10000,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#333333B3',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </Box>
  )
});
