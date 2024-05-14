import React, { forwardRef } from 'react';
import { Box } from '../Box';
import { ModalBackdropStyles as styles } from './Modal.styles';

const ModalBackdrop = forwardRef(({ children, onClick = () => {} }, ref) => (
  <Box ref={ref} onClick={onClick} css={styles.modalBackdrop}>
    {children}
  </Box>
));
ModalBackdrop.displayName = 'ModalBackdrop';
export { ModalBackdrop };
