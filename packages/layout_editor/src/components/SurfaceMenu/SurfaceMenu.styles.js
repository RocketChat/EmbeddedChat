import { css } from "@emotion/react";

export const getSurfaceItemStyles = (customTheme) => {
  const { theme, colors } = customTheme;

  const styles = {
    overlayBox: css`
      width: 24px;
      height: 24px;
      border: 1px solid ${colors.border};
      border-radius: ${theme.schemes.radius};
    `,
  };

  return styles;
};
