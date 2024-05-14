import { useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { ModalFooterStyles as styles } from './Modal.styles';

export const ModalFooter = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalFooter');
  const theme = useTheme();

  return (
    <Box
      css={styles.modalFooter(theme)}
      className={`ec-modal-footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
