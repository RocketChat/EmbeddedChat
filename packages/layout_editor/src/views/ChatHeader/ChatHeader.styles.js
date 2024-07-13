import { css } from "@emotion/react";
import { darken } from "@embeddedchat/ui-elements";

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const getChatHeaderStyles = (customTheme) => {
  const { theme, mode, colors } = customTheme;

  const styles = {
    clearSpacing: css`
      margin: 0;
      padding: 0;
    `,

    chatHeaderChild: css`
      ${rowCentreAlign}
      padding: 0 0.75rem;
      justify-content: space-between;
      width: 100%;
    `,

    chatHeaderParent: css`
      background-color: ${mode === "light"
        ? darken(colors.background, 0.03)
        : colors.secondary};
      width: 100%;
      z-index: ${theme.zIndex.general};
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      box-shadow: ${theme.shadows[1]};
    `,

    channelDescription: css`
      ${rowCentreAlign}
      gap: 0.5rem;
    `,

    chatHeaderIconRow: css`
      ${rowCentreAlign}
      position:relative;
      gap: 0.5rem;
    `,

    overlayBox: css`
      width: 24px;
      height: 24px;
      border: 1px solid ${colors.border};
      border-radius: ${theme.schemes.radius};
    `,
  };

  return styles;
};
