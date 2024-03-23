import { css, useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

export const ModalTitle = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalTitle');
  const theme = useTheme();
  const ModalTitleCss = css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    margin: 0.25rem !important;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
  `;
  return (
    <Box
      css={ModalTitleCss}
      className={`ec-modal-title ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
