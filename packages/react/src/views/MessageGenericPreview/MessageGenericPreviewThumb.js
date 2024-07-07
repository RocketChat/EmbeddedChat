import React from 'react';
import { Box } from '@embeddedchat/ui-elements';
import useComponentOverrides from '../../hooks/useComponentOverrides';

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
