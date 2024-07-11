import { css } from '@emotion/react';
import { darken, useTheme } from '@embeddedchat/ui-elements';

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const useChatHeaderStyles = () => {
  const { theme, mode, colors } = useTheme();
  const clearSpacing = css`
    margin: 0;
    padding: 0;
  `;

  const chatHeaderChild = css`
    ${rowCentreAlign}
    padding: 0 0.75rem;
    justify-content: space-between;
    width: 100%;
  `;

  const chatHeaderParent = css`
    background-color: ${mode === 'light'
      ? darken(colors.background, 0.03)
      : colors.secondary};
    width: 100%;
    z-index: ${theme.zIndex.general};
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    box-shadow: ${theme.shadows[1]};
  `;

  const channelDescription = css`
    ${rowCentreAlign}
    gap: 0.5rem;
  `;

  const chatHeaderIconRow = css`
    ${rowCentreAlign}
    position:relative;
    gap: 0.5rem;
  `;

  return {
    clearSpacing,
    chatHeaderChild,
    chatHeaderParent,
    channelDescription,
    chatHeaderIconRow,
  };
};

export default useChatHeaderStyles;
