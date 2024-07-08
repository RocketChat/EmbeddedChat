import React from 'react';
import { Box } from '../Box';
import { useComponentOverrides } from '../../hooks';

const MessageGenericPreviewDescription = ({
  children,
  clamp = false,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewDescription'
  );

  return (
    <Box
      className={`ec-message-generic-preview__description ${
        clamp ? 'ec-message-generic-preview__description--clamp' : ''
      } ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default MessageGenericPreviewDescription;
