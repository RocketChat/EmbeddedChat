import { css } from '@emotion/react';

export const ImageElementStyles = {
  container: (imageUrl, size) => css`
    box-shadow: 0 0 0px 1px rgba(204, 204, 204, 38%);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    background-color: rgba(204, 204, 204, 38%);
    background-image: url(${imageUrl});
    width: ${String(size)}px;
    height: ${String(size)}px;
    border-radius: 4px;
    overflow: hidden;
    margin-inline-start: 4px;
  `,
};

export const LinearScaleElementStyles = {
  parentContainer: css`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  `,

  childContainer: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-inline: -0.25rem;
    min-width: 0;
  `,
};
