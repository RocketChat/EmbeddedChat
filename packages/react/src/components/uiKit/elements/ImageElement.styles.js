import { css } from '@emotion/react';
import React from 'react';

export const Element = ({ imageUrl, size }) => {
  const ElementCss = css`
    box-shadow: 0 0 0px 1px rgba(204, 204, 204, 38%);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    background-color: rgba(204, 204, 204, 38%);
    background-image: url(${imageUrl});
    width: ${String(size)}px;
    height: ${String(size)}px;
    border-radius: 4px;
    overflow: hidden;
    margin-inline-start: 4px;
  `;
  return <div css={ElementCss} />;
};
