import { css } from '@emotion/react';

const getLinkPreviewStyles = (theme) => {
  const styles = {
    arrowDropDown: css`
      cursor: pointer;
      display: flex;
      align-items: center;
    `,

    linkPreviewContainer: css`
      max-width: 16rem;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
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

  return styles;
};

export default getLinkPreviewStyles;
