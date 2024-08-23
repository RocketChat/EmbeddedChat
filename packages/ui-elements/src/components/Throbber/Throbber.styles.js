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

const getThrobberStyles = (theme) => {
  const styles = {
    circle: (size, circleCount, iteration) => css`
      height: ${size};
      width: ${size};
      margin-inline: 0.125rem;
      animation: ${BounceFrames} 1.4s infinite ease-in-out both;
      border-radius: 100%;
      background-color: ${theme.colors.primary};
      animation-duration: ${circleCount * 0.466}s;
      animation-delay: ${iteration * 0.16}s;
      &.disabled {
        background-color: ${theme.colors.muted};
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

  return styles;
};

export default getThrobberStyles;
