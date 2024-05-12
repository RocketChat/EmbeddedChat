import { useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { ModalTitleStyles as styles } from './Modal.styles';

export const ModalTitle = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalTitle');
  const theme = useTheme();

  return (
    <Box
      css={styles.modalTitle(theme)}
      className={`ec-modal-title ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
