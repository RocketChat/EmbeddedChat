import { css } from '@emotion/react';

// Define Reusable CSS constants
const toRem = (pixels) => `${pixels / 16}rem`;

// Emotion styles
const styles = {
  ecGrid: css`
    display: flex;
    flex-flow: row wrap;
    margin-block: calc(${toRem(16)} / -2);
    margin-inline: calc(${toRem(16)} / -2);
  `,
  ecGridWrapper: css`
    overflow: hidden;
  `,
};
