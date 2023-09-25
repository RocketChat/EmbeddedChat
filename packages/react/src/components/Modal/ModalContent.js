import { css, useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

export const ModalContent = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalContent');
  const theme = useTheme();
  const ModalContentCss = css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    position: relative;
    overflow-y: auto !important;
  `;
  return (
    <Box
      css={ModalContentCss}
      className={`ec-modal-content ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
