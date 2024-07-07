import { keyframes, css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';

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

const useThrobberStyles = () => {
  const { colors } = useTheme();
  const circle = (size, circleCount, iteration) => css`
    height: ${size};
    width: ${size};
    margin-inline: 0.125rem;
    animation: ${BounceFrames} 1.4s infinite ease-in-out both;
    border-radius: 100%;
    background-color: ${colors.primary};
    animation-duration: ${circleCount * 0.466}s;
    animation-delay: ${iteration * 0.16}s;
    &.disabled {
      background-color: ${colors.muted};
    }
    &.inherit-color {
      background-color: currentColor;
    }
  `;

  const throbber = css`display: flex;
  width: fit-content
  margin-block: -0.125rem;
  `;

  return { circle, throbber };
};

export default useThrobberStyles;
