import { useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { ModalContentStyles as styles } from './Modal.styles';

export const ModalContent = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalContent');
  const theme = useTheme();

  return (
    <Box
      css={styles.modalContent(theme)}
      className={`ec-modal-content ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
