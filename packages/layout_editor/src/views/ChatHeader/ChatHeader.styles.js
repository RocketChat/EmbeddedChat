import { css } from '@emotion/react';
import { darken, lighten } from '@embeddedchat/ui-elements';

export const getChatHeaderStyles = ({ theme, mode }) => {
  const styles = {
    clearSpacing: css`
      margin: 0;
      padding: 0;
    `,

    chatHeaderChild: css`
      display: flex;
      flex-direction: ;
      align-items: center;
      padding: 0 0.75rem;
      justify-content: space-between;
      width: 100%;
    `,

    chatHeaderParent: css`
      background-color: ${mode === 'light'
        ? darken(theme.colors.background, 0.03)
        : lighten(theme.colors.background, 1)};
      width: 100%;
      z-index: 1200;
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      box-shadow: ${theme.shadows[1]};
    `,

    channelDescription: css`
      display: flex;
      flex-direction: ;
      align-items: center;
      gap: 0.5rem;
    `,

    chatHeaderIconRow: css`
      display: flex;
      flex-direction: ;
      align-items: center;
      position: relative;
      gap: 0.5rem;
    `,

    overlayBox: css`
      width: 24px;
      height: 24px;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
    `,
  };

  return styles;
};
