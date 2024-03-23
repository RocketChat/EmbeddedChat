import { css } from '@emotion/react';
import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { ActionButton } from '../ActionButton';
import { Box } from '../Box';

export const ModalClose = ({
  className = '',
  style = {},
  children,
  onClick = () => {},
  tabIndex,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ModalClose');
  const ModalCloseCss = css`
    margin: 0.25rem !important;
  `;
  return (
    <Box
      css={ModalCloseCss}
      className={`ec-modal-close ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      <ActionButton ghost icon="cross" onClick={onClick} tabIndex={tabIndex} />
    </Box>
  );
};
