import { css } from '@emotion/react';

export const markdownStyles = {
  p: css`
    margin: 0;
    padding: 0;
  `,
  code: css`
    font-family: 'Menlo', monospace;
    color: #333;
    border-color: #ccc;
    background-color: #f8f8f8;
    margin: 5px 0;
    padding: 0.5em;
    font-size: 13px;
    font-weight: 600;
  `,
  joypixels: css`
    height: 1.5rem;
    width: 1.5rem;
    image-rendering: pixelated;
    font-size: inherit; // Use 'inherit' to match text size
    vertical-align: middle; // Hotfix in "Markdown.css"
  `,
  joypixels_BigEmoji: css`
    height: 2.75rem;
    width: 2.75rem;
    image-rendering: pixelated;
    font-size: inherit; // Use 'inherit' to match text size
  `,
  emojione: css`
    margin: 0 0.15em;
    vertical-align: middle;
    white-space: nowrap;
    font-size: inherit;
    line-height: normal;
  `,
};
