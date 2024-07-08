import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import { useComponentOverrides } from '../../hooks';

const MessageGenericPreviewFooter = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewFooter'
  );

  return (
    <Box
      css={css`
        padding: 0.5rem 0;
      `}
      className={`ec-message-generic-preview__footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default MessageGenericPreviewFooter;
