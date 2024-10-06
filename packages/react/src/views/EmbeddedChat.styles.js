import { css } from '@emotion/react';

export const styles = {
  embeddedchat: (theme, dark) => css`
    background: ${theme.schemes[dark ? 'dark' : 'light'].background};
    color: ${theme.schemes[dark ? 'dark' : 'light'].foreground};
    display: flex;
    flex-direction: column;
    border: ${`1.5px solid  ${theme.schemes[dark ? 'dark' : 'light'].border}`};
    border-radius: ${theme.radius};
    overflow: hidden;
  `,
  fullscreen: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    max-width: unset !important;
    max-height: unset !important;
    border-radius: 0;
    border: none;
  `,
};
