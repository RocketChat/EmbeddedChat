import { keyframes, css } from '@emotion/react';

const animation = keyframes`
0% {
  opacity: 0;
}
20% {
  opacity: 1;
}
80% {
  opacity: 1;
}
100% {
  opacity: 0;
}
`;

export const getToastbarStyles = (theme) => {
  const styles = {
    toastbar: (color, bgColor, time) => css`
      display: flex;
      flex-direction: row;
      gap: 1em;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      max-width: 20rem;
      color: ${color};
      background-color: ${bgColor};
      border-radius: ${theme.radius} ${theme.radius} 0 0;
      padding: 0.75em 1em;
      z-index: ${theme.zIndex?.toastbar || 1600};
      animation: ${animation} ${time}ms ease-in-out forwards;
    `,
  };

  return styles;
};

export const getToastBarContainerStyles = (theme, mode) => {
  const styles = {
    container: css`
      position: absolute;
      z-index: ${theme.zIndex?.toastbar || 1600};
      border-radius: ${theme.radius};
      animation: ${animation} ${2000}ms ease-in-out forwards;
      box-shadow: ${mode === 'light'
        ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        : null};
    `,
  };
  return styles;
};

export const getProgressBarStyles = (theme, mode, progress, color) => {
  const styles = {
    progressBarContainer: css`
      width: 100%;
      height: 7px;
      border-radius: 0 0 ${theme.radius} ${theme.radius};
      background-color: ${mode === 'dark' ? theme.colors.foreground : null};
    `,
    progressbar: css`
      width: ${progress}%;
      height: 100%;
      background-color: ${color};
      border-radius: 0 0 ${theme.radius} ${theme.radius};
      transition: width 0.02s linear;
    `,
  };
  return styles;
};
