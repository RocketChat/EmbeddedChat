/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const square = (width, height = width) => css`
  width: ${width};
  height: ${height};
`;

const resize = (scale) => css`
  transform: scale(${scale});
`;

// Example usage
const myStyle = css`
  ${square('50px', '60px')};
  ${resize(1.5)};
`;
