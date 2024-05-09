import { css } from '@emotion/react';

export const dropBoxStyles = {
  dropBox: css`
    z-index: 300;
    opacity: 25%;
    flex-direction: column;
    animation-name: inherit;
    animation-duration: 0.1s;
    transition: all 0.1s ease-in;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  `,

  border: css`
    position: relative;
    top: 0;
    left: 0;
    z-index: 9999;
    border: 4px dashed #007fff !important;
  `,
};

export const dropBoxOverlayStyles = {
  overlay: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #007fff;
    z-index: 10000;
  `,
};
