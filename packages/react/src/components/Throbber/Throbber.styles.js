import { keyframes, css } from '@emotion/react';

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

const styles = {
  circle: (theme, size, circleCount, iteration) => css`
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
  `,

  throbber: css`display: flex;
  width: fit-content
  margin-block: -0.125rem;
  `,
};

export default styles;
