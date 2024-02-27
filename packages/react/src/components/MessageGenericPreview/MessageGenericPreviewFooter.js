import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';

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
    <div
      className={`ec-message-generic-preview__footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </div>
  );
};

export default MessageGenericPreviewFooter;
