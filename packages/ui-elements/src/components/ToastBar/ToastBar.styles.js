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

export const getToastbarStyles = (theme, mode) => {
  const styles = {
    toastbar: (color, bgColor, time) => css`
      display: flex;
      flex-direction: column;
      gap: 1em;
      align-items: flex-start;
      justify-content: flex-start;
      width: fit-content;
      max-width: 20rem;
      color: ${color};
      background-color: ${bgColor};
      border-radius: ${theme.radius};
      padding: 0.75em 1em;
      z-index: ${theme.zIndex?.toastbar || 1600};
      animation: ${animation} ${time}ms ease-in-out forwards;
      position: relative;
      overflow: hidden;
    `,
    content: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    `,
    progressBarContainer: css`
      position: absolute;
      bottom: 0;
      left: 0;
      height: 5px;
      width: 100%;
      background-color: ${mode === 'dark' ? theme.colors.foreground : null};
      clip-path: inset(0 0 0 0 round ${theme.radius});
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
    progressbar: css`
      width: ${progress}%;
      height: 100%;
      background-color: ${color};
      transition: width 0.02s linear;
    `,
  };
  return styles;
};
