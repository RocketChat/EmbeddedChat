import React from 'react';
import { css } from '@emotion/react';

// eslint-disable-next-line react/prop-types
export const Image = ({ imageUrl, width, height, ...props }) => {
  const ImageCss = css`
    box-shadow: 0 0 0px 1px rgba(204, 204, 204, 38%);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    background-color: rgba(204, 204, 204, 38%);
    background-image: url(${imageUrl});
    width: ${String(width)}px;
    height: ${String(height)}px;
    overflow: hidden;
  `;

  return <div css={ImageCss} {...props} />;
};
