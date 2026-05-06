import { css } from '@emotion/react';

const getEmojiListStyles = (theme) => {
  const styles = {
    main: css`
      margin: 0.2rem 2rem;
      display: block;
      max-height: 10rem;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.2rem;
      background-color: ${theme.colors.background};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      position: relative;
    `,

    listItem: css`
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      font-size: 14px;
      border-bottom: 1px solid ${theme.colors.border};
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${theme.colors.secondary};
      }

      &:last-child {
        border-bottom: none;
      }
    `,

    emoji: css`
      font-size: 16px;
      margin-right: 0.5rem;
      flex-shrink: 0;
    `,

    shortname: css`
      font-family: monospace;
      color: ${theme.colors.mutedForeground};
      font-size: 12px;
    `,
  };

  return styles;
};

export default getEmojiListStyles;
