import { css } from "@emotion/react";
import { lighten, darken } from "@embeddedchat/ui-elements";

export const getMenuStyles = (customTheme) => {
  const { theme, colors } = customTheme;

  const styles = {
    wrapper: css`
      position: relative;
    `,

    container: css`
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      width: fit-content;
      height: fit-content;
      z-index: ${theme.zIndex.menu};
      border-radius: 0.2em;
      padding: 0.5rem 0;
      box-shadow: ${theme.shadows[1]};
      background-color: ${colors.background};
    `,
  };

  return styles;
};

export const getMenuItemStyles = (customTheme) => {
  const { mode, colors } = customTheme;

  const styles = {
    item: css`
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0.25em 0.75em;
      white-space: nowrap;
      gap: 0.2rem;
      color: ${colors.foreground};
      &:hover {
        background-color: ${mode === "light"
          ? darken(colors.background, 0.05)
          : lighten(colors.background, 2)};
        cursor: pointer;
      }
    `,

    mainItems: css`
      display: flex;
      align-items: center;
      gap: 0.2rem;
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${colors.mutedForeground};
    `,

    icon: css`
      visibility: hidden;
      &:hover {
        fill: ${colors.destructive};
      }
    `,

    showIcon: css`
      &:hover .crossIcon {
        visibility: visible;
        cursor: pointer;
      }
    `,

    dragOverlay: css`
      padding: 0.5rem 0.75em;
      border: 1px solid ${colors.border};
      border-right: none;
      border-left: none;
    `,
  };

  return styles;
};
