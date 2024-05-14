import { css } from '@emotion/react';

const styles = {
  embeddedchat: css`
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-align: initial;
  `,
  fullscreen: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    max-width: unset !important;
    max-height: unset !important;
    background: #fff;
  `,
};

export default styles;
