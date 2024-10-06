import { css } from '@emotion/react';

const getMultiSelectStyles = (theme) => {
  const styles = {
    main: css`
      display: inline-flex;
      flex: 1 0 auto;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 8rem;
    `,

    selectBox: css`
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 5rem;
      background-color: transparent;
      letter-spacing: 0rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      color: ${theme.colors.foreground};
      border-width: 1px;
      border-color: ${theme.colors.border};
      border-style: solid;
      border-radius: ${theme.radius};
      background-color: ${theme.colors.background};
    `,

    clickStyle: css`
      border-color: ${theme.colors.ring};
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${theme.colors.mutedForeground};
    `,

    selectedItemsContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    `,

    selectedItems: css`
      background: ${theme.colors.muted};
      padding: 0.2rem;
      display: flex;
      justify-self: flex-start;
      gap: 0.2rem;
    `,
  };

  return styles;
};

export default getMultiSelectStyles;
