import { css } from '@emotion/react';

export const styles = {
  embeddedchat: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-align: initial;
  `,
  fullscreen: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  `,
};
