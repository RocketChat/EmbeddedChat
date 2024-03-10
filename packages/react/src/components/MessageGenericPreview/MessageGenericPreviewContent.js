import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreviewContent = ({
  className = '',
  style = {},
  thumb,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewContent'
  );

  const MessageGenericPreviewContentCss = css`
    display: flex;
    flex-direction: row;
  `;

  return (
    <div
      css={MessageGenericPreviewContentCss}
      className={`ec-message-generic-preview__content ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
    >
      {thumb}
      <div className="ec-message-generic-preview__content-wrapper" {...props} />
    </div>
  );
};

export default MessageGenericPreviewContent;
