import { css, keyframes, useTheme } from '@emotion/react';
import React, { forwardRef } from 'react';

import { Box } from '../Box';

function Circle({
  disabled,
  circleCount,
  iteration,
  inheritColor,
  size,
  ...props
}) {
  const theme = useTheme();
  const BounceFrames = keyframes`
    0%,
    80%,
    100% {
      transform: scale(0);
    }

    40% {
      transform: scale(1);
    }
  `;
  const CircleCss = css`
    height: ${size};
    width: ${size};
    margin-inline: 0.125rem;
    animation: ${BounceFrames} 1.4s infinite ease-in-out both;
    border-radius: 100%;
    background-color: ${theme?.palette?.primary?.main || '#007FFF'};
    animation-duration: ${circleCount * 0.466}s;
    animation-delay: ${iteration * 0.16}s;
    &.disabled {
      background-color: ${theme?.palette?.secondary?.main || '#e4e7ea'};
    }
    &.inherit-color {
      background-color: currentColor;
    }
  `;
  return (
    <Box
      css={CircleCss}
      className={`${disabled ? 'disabled' : ''} ${
        inheritColor ? 'inherit-color' : ''
      }`}
      {...props}
    />
  );
}

const Throbber = forwardRef(
  (
    { disabled, size = '16px', circleCount = 3, inheritColor, ...props },
    ref
  ) => {
    const ThrobberCss = css`
      display: flex;
      margin-block: -0.125rem;
    `;
    return (
      <Box css={ThrobberCss} ref={ref} {...props}>
        {Array.from({ length: circleCount || 3 }, (_, iteration) => (
          <Circle
            key={iteration}
            circleCount={circleCount}
            iteration={iteration}
            disabled={!!disabled}
            size={size}
            inheritColor={!!inheritColor}
          />
        ))}
      </Box>
    );
  }
);
Throbber.displayName = 'Throbber';

export default Throbber;
