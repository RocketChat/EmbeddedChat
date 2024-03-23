import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreviewTitle = ({
  externalUrl,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewTitle'
  );

  if (externalUrl) {
    return (
      <a
        className={`ec-message-generic-preview__title ${className} ${classNames}`}
        style={{ ...style, ...styleOverrides }}
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <span
      className={`ec-message-generic-preview__title ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </span>
  );
};

export default MessageGenericPreviewTitle;
