import { css, useTheme } from '@emotion/react';

const useChannelStateStyles = () => {
  const theme = useTheme();

  const channelStateContainer = css`
    font-size: 0.75rem;
    padding: 0 0.25rem;
    z-index: ${theme.zIndex.general};
    display: flex;
    justify-content: space-between;
  `;

  const channelStateMessage = css`
    background-color: #cbced1;
    padding: 0 0.25rem;
    display: flex;
    gap: 0.1rem;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    color: #2f343d;
  `;

  return { channelStateContainer, channelStateMessage };
};

export default useChannelStateStyles;
