import { css } from '@emotion/react';

const styles = {
  arrowDropDown: css`
    cursor: pointer;
    display: flex;
    align-items: center;
  `,

  linkPreviewContainer: css`
    max-width: 22rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
  `,

  textStyle: css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-block-start: 0rem;
    margin-block-end: 0rem;
  `,
};

export default styles;
