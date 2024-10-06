import React, { forwardRef } from 'react';
import { Box } from '../Box';
import { getModalBackdropStyles } from './Modal.styles';
import { useTheme } from '../../hooks';

const ModalBackdrop = forwardRef(({ children, onClick = () => {} }, ref) => {
  const { theme } = useTheme();
  const styles = getModalBackdropStyles(theme);

  return (
    <Box ref={ref} onClick={onClick} css={styles.modalBackdrop}>
      {children}
    </Box>
  );
});
ModalBackdrop.displayName = 'ModalBackdrop';
export { ModalBackdrop };
