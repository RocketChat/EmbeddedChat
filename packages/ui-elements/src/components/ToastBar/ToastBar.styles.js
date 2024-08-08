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

export const toastbarStyles = {
  toastbar: (theme, color, bgColor, time) => css`
    display: flex;
    flex-direction: row;
    gap: 1em;
    align-items: center;
    justify-content: space-between;
    width: fit-content;
    max-width: 20rem;
    color: ${color};
    background-color: ${bgColor};
    border-radius: ${theme.schemes.radius};
    padding: 0.75em 1em;
    z-index: ${theme.zIndex?.toastbar || 1600};
    animation: ${animation} ${time}ms ease-in-out forwards;
  `,
};

export const toastBarContainerStyles = {
  container: (theme) => css`
    position: absolute;
    z-index: ${theme.zIndex?.toastbar || 1600};
    border-radius: ${theme.schemes.radius};
    animation: ${animation} ${2000}ms ease-in-out forwards;
  `,
};
