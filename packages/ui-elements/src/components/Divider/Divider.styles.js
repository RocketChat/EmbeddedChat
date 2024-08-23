import { css } from '@emotion/react';

const getDividerStyles = (theme) => {
  const styles = {
    divider: css`
      height: 2px;
      margin: 0 8px 8px;
      border: 0;
      border-radius: ${theme.radius};
      background-color: ${theme.colors.secondary};
    `,
  };

  return styles;
};

export default getDividerStyles;
