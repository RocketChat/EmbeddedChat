import React from 'react';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../theme/useComponentOverrides';

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
