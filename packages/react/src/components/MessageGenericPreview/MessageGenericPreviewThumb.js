import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreviewThumb = (className = '', style = {}, ...props) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewThumb'
  );
  return (
    <div
      className={`ec-message-generic-preview__thumb ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default MessageGenericPreviewThumb;
