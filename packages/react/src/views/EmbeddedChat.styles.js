import { css } from '@emotion/react';

const styles = {
  embeddedchat: css`
    background: #fff;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
  `,
  fullscreen: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    max-width: unset !important;
    max-height: unset !important;
  `,
};

export default styles;
