import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useChannelStateStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const channelStateContainer = css`
    font-size: 0.75rem;
    padding: 0.2rem 2rem;
    z-index: ${theme.zIndex.general};
    display: flex;
    justify-content: space-between;
  `;

  const channelStateMessage = css`
    background-color: ${colors.secondary};
    display: flex;
    gap: 0.1rem;
    padding: 1.5px 5px;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.schemes.radius};
    color: ${colors.secondaryForeground};
  `;

  return { channelStateContainer, channelStateMessage };
};

export default useChannelStateStyles;
