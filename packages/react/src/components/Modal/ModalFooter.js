import { css, useTheme } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

export const ModalFooter = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalFooter');
  const theme = useTheme();
  const ModalFooterCss = css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    -webkit-box-pack: end !important;
    -ms-flex-pack: end !important;
    -webkit-justify-content: end !important;
    justify-content: end !important;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 0.5rem;
  `;
  return (
    <Box
      css={ModalFooterCss}
      className={`ec-modal-footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
