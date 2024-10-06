import { css } from '@emotion/react';

const getQuoteMessageStyles = (theme) => {
  const styles = {
    messageContainer: css`
      margin: 0.2rem 2rem;
      position: relative;
      font-size: 0.85rem;
      background-color: ${theme.colors.background};
      color: ${theme.colors.foreground};
      padding: 0.5rem;
      z-index: 1200;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
    `,

    avatarContainer: css`
      padding: 0.25rem;
      display: flex;
      gap: 0.5rem;
    `,

    message: css`
      padding: 0.25rem;
    `,

    actionBtn: css`
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    `,
  };

  return styles;
};

export default getQuoteMessageStyles;
