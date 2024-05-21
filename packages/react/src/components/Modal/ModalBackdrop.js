import React, { forwardRef } from 'react';
import { Box } from '../Box';
import { useModalBackdropStyles } from './Modal.styles';

const ModalBackdrop = forwardRef(({ children, onClick = () => {} }, ref) => {
  const styles = useModalBackdropStyles();

  return (
    <Box ref={ref} onClick={onClick} css={styles.modalBackdrop}>
      {children}
    </Box>
  );
});
ModalBackdrop.displayName = 'ModalBackdrop';
export { ModalBackdrop };
