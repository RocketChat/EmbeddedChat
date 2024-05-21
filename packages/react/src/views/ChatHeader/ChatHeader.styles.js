import { css, useTheme } from '@emotion/react';

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const useChatHeaderStyles = () => {
  const theme = useTheme();

  const clearSpacing = css`
    margin: 0;
    padding: 0;
  `;

  const chatHeaderChild = css`
    ${rowCentreAlign}
    justify-content: space-between;
    width: 100%;
  `;

  const chatHeaderParent = css`
    width: 100%;
    z-index: ${theme.zIndex.general};
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    box-shadow: 0 3px 2px -2px grey;
  `;

  const channelDescription = css`
    ${rowCentreAlign}
    gap: 0.5rem;
  `;

  const chatHeaderIconRow = css`
    ${rowCentreAlign}
    gap:0.5rem
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
