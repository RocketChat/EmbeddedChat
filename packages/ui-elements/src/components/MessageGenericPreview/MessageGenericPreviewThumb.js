import React from 'react';
import { Box } from '../Box';
import { useComponentOverrides } from '../../hooks';

const MessageGenericPreviewThumb = (className = '', style = {}, ...props) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewThumb'
  );
  return (
    <Box
      className={`ec-message-generic-preview__thumb ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default MessageGenericPreviewThumb;
