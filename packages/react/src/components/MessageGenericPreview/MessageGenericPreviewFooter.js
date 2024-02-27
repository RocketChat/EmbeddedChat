import React from 'react';
import { css } from '@emotion/react';
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
  const MessageGenericPreviewFooterCss = css`
    padding: 0.5rem 0;
  `;

  return (
    <div
      css={MessageGenericPreviewFooterCss}
      className={`ec-message-generic-preview__footer ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </div>
  );
};

export default MessageGenericPreviewFooter;
