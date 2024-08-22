import { css } from '@emotion/react';

export const getSurfaceItemStyles = ({ theme }) => {
  const styles = {
    overlayBox: css`
      width: 24px;
      height: 24px;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
    `,

    itemContainer: css`
      &:hover .crossIcon {
        visibility: visible;
        cursor: pointer;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${theme.colors.secondary};
        border: 1px solid ${theme.colors.border};
      }
    `,

    iconBox: css`
      position: absolute;
      bottom: 60%;
      right: 0;
      visibility: hidden;
    `,

    icon: css`
      &:hover {
        fill: ${theme.colors.destructive};
      }
    `,
  };

  return styles;
};
