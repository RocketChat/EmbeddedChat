import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';
import { lighten, darken } from '../../lib/color';

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const useChatHeaderStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

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
    background-color: ${mode === 'light'
      ? darken(colors.background, 0.03)
      : colors.secondary};
    width: 100%;
    z-index: ${theme.zIndex.general};
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    box-shadow: ${theme.shadows[1]};
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius} 0 0;
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
