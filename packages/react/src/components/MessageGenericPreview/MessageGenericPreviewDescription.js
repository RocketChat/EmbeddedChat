import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';

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
    <div
      className={`ec-message-generic-preview__description ${
        clamp ? 'ec-message-generic-preview__description--clamp' : ''
      } ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </div>
  );
};

export default MessageGenericPreviewDescription;
