import { css } from '@emotion/react';
import { useTheme } from '@embeddedchat/ui-elements';

const useChannelStateStyles = () => {
  const { theme } = useTheme();
  const channelStateContainer = css`
    font-size: 0.75rem;
    padding: 0.2rem 2rem;
    z-index: 1200;
    display: flex;
    justify-content: space-between;
  `;

  const channelStateMessage = css`
    background-color: ${theme.secondary};
    display: flex;
    gap: 0.1rem;
    padding: 1.5px 5px;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius};
    color: ${theme.secondaryForeground};
  `;

  return { channelStateContainer, channelStateMessage };
};

export default useChannelStateStyles;
