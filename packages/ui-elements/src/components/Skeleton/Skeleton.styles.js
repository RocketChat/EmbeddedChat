import { css, keyframes } from '@emotion/react';
import { lighten } from '../../lib/color';

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

const getSkeletonStyles = (theme) => {
  const styles = {
    skeleton: css`
      height: 1.2em;
      animation: ${animation} 1s linear 0s infinite running;
      border-radius: 0.25rem;
      background: ${lighten(theme.commonColors.black, 2)};

      &.text {
        height: auto;
        margin-block: none;
        transform: scale(1, 0.6);
        transform-origin: 0 60%;
      }
      &.circle {
        border-radius: 50%;
      }
    `,
  };

  return styles;
};

export default getSkeletonStyles;
