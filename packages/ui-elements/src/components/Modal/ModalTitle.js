import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { ModalTitleStyles as styles } from './Modal.styles';

export const ModalTitle = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalTitle');
  return (
    <Box
      css={styles.modalTitle}
      className={`ec-modal-title ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
