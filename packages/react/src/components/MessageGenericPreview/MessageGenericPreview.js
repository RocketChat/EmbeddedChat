import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreview = (props, className = '', style = {}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreview'
  );
  const messageGenericPreviewStyles = css`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #cbced1;
  `;
  return (
    <div
      css={messageGenericPreviewStyles}
      className={`ec-message-generic-preview ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default MessageGenericPreview;
