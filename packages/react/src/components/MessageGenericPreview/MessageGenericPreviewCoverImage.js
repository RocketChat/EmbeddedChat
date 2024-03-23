import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreviewCoverImage = ({
  className = '',
  style = {},
  url,
  width,
  height,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewCoverImage'
  );

  const previewCoverImageCss = css`
    background-image: url(${url});
    max-width: 100%;
  `;

  return (
    <div
      css={previewCoverImageCss}
      className={`ec-message-generic-preview__preview ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      <div style={{ paddingTop: `${(height / width) * 100}%` }} />
    </div>
  );
};

export default MessageGenericPreviewCoverImage;
