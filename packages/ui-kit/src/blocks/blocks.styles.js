import { css } from '@emotion/react';

export const ImageBlockStyles = {
  image: (imageUrl, width, height) => css`
    box-shadow: 0 0 0px 1px rgba(204, 204, 204, 38%);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    background-color: rgba(204, 204, 204, 38%);
    background-image: url(${imageUrl});
    width: ${String(width)}px;
    height: ${String(height)}px;
    overflow: hidden;
  `,

  imageBlock: (alignment) => css`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: ${alignment};
  `,
  imageTitle: (width) => css`
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;
    margin-block-end: -0.25rem;
    width: ${width};
  `,
};

export const ContextBlockItemStyles = {
  ContextBlock: css`
    display: inline-block;
    padding: 0 0.75rem;
    font-size: 0.8rem;
    margin: -0.25rem;
  `,
};
