import { css, keyframes } from '@emotion/react';
import React from 'react';
import { Box } from '../Box';

const Skeleton = ({ variant = 'text', height, width, ...props }) => {
  const animation = keyframes`
    0% {
      opacity: 0.1;
    }

    50% {
      opacity: 0.2;
    }

    100% {
      opacity: 0.1;
    }
  `;
  const SkeletonCss = css`
    height: 1.2em;
    animation: ${animation} 1s linear 0s infinite running;
    border-radius: 0.25rem;
    background: #bcbbbb;

    &.text {
      height: auto;
      margin-block: none;
      transform: scale(1, 0.6);
      transform-origin: 0 60%;
    }
    &.circle {
      border-radius: 50%;
    }
  `;
  return (
    <Box
      css={SkeletonCss}
      style={{ display: 'inlineBlock', height, width }}
      className={`ec-skeleton ${variant}`}
      {...props}
    />
  );
};
export default Skeleton;
