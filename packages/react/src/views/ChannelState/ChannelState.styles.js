import { css } from '@emotion/react';

const getChannelStateStyles = (theme) => {
  const styles = {
    channelStateContainer: css`
      font-size: 0.75rem;
      padding: 0.2rem 2rem;
      z-index: 1200;
      display: flex;
      justify-content: space-between;
    `,

    channelStateMessage: css`
      background-color: ${theme.secondary};
      display: flex;
      gap: 0.1rem;
      padding: 1.5px 5px;
      justify-content: center;
      align-items: center;
      border-radius: ${theme.radius};
      color: ${theme.secondaryForeground};
    `,
  };

  return styles;
};

export default getChannelStateStyles;
