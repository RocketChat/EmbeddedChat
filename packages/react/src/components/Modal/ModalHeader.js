import { css } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

export const ModalHeader = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalHeader');
  const ModalHeaderCss = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  `;
  return (
    <Box
      css={ModalHeaderCss}
      className={`ec-modal-header ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
