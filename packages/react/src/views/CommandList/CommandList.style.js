import { css } from '@emotion/react';

const getCommandListStyles = (theme) => {
  const styles = {
    main: css`
      margin: 0.2rem 2rem;
      display: block;
      max-height: 145px;
      overflow-y: auto;
      overflow-x: hidden;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.25rem;
      color: ${theme.colors.secondaryForeground};
      background: ${theme.colors.background};
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    `,

    listItem: css`
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      gap: 0.5rem;
      transition: background-color 0.12s ease;
      border-left: 3px solid transparent;

      &:hover {
        background-color: ${theme.colors.secondary};
      }
    `,

    listItemActive: css`
      background-color: ${theme.colors.primary}22;
      border-left: 3px solid ${theme.colors.primary};
    `,

    commandName: css`
      font-weight: 600;
      font-family: monospace;
      font-size: 0.875rem;
      color: ${theme.colors.primary};
    `,

    commandParams: css`
      font-size: 0.8rem;
      font-family: monospace;
      color: ${theme.colors.secondaryForeground};
      opacity: 0.75;
    `,

    commandDescription: css`
      font-size: 0.8rem;
      color: ${theme.colors.secondaryForeground};
      text-align: right;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,

    leftSection: css`
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
      min-width: 0;
    `,
  };

  return styles;
};

export default getCommandListStyles;
