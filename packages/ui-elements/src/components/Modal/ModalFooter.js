import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { ModalFooterStyles as styles } from './Modal.styles';

export const ModalFooter = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalFooter');

  return (
    <Box
      css={styles.modalFooter}
      className={`ec-modal-footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
