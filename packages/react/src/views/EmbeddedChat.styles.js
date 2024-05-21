import { css } from '@emotion/react';

const styles = {
  embeddedchat: (theme, dark) => css`
    background: ${theme.schemes[dark ? 'dark' : 'light'].background};
    color: ${theme.schemes[dark ? 'dark' : 'light'].foreground};
    display: flex;
    flex-direction: column;
    border: ${`1px solid  ${theme.schemes[dark ? 'dark' : 'light'].border}`};
    border-radius: ${theme.schemes.radius};
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
  `,
};

export default styles;
