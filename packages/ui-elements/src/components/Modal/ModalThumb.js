import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { Avatar } from '../Avatar';
import { ModalThumbStyles as styles } from './Modal.styles';

export const ModalThumb = ({ className = '', style = {}, url, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalThumb');
  return (
    <Box
      css={styles.modalThumb}
      className={`ec-modal-thumb ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      <Avatar url={url} fallbackIcon="" size="1.75rem" />
    </Box>
  );
};
