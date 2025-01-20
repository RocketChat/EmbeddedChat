import { css } from '@emotion/react';

const getAttachedFileStyles = (theme) => {
  const styles = {
    fileContainer: css`
      width: auto;
      display: inline-block;
      max-width: 100%;
      padding-right: 6rem;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
      margin-bottom: 0.75rem;
      overflow: hidden;
    `,
  };

  return styles;
};

export default getAttachedFileStyles;
