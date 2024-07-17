import { css } from '@emotion/react';

export const styles = {
  embeddedchat: (theme, dark) => css`
    width: 75%;
    position: relative;
    background: ${theme.schemes[dark ? 'dark' : 'light'].background};
    color: ${theme.schemes[dark ? 'dark' : 'light'].foreground};
    display: flex;
    flex: 1;
    flex-direction: column;
    border: ${`1.5px solid  ${theme.schemes[dark ? 'dark' : 'light'].border}`};
    border-radius: ${theme.schemes.radius};
    overflow: hidden;
  `,

  layoutEditor: css`
    height: 100vh;
    display: flex;
    gap: 0.25rem;
  `,
};
