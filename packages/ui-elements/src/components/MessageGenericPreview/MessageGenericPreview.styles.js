import { css } from '@emotion/react';

export const getMessageGenericPreviewStyles = (theme) => {
  const styles = {
    container: css`
      display: flex;
      overflow: hidden;
      flex-direction: column;
      padding: 0.75rem;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
      background-color: ${theme.colors.background};
    `,
  };

  return styles;
};
