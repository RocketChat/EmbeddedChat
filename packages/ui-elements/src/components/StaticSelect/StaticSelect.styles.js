import { css } from '@emotion/react';

const getStaticSelectStyles = (theme) => {
  const styles = {
    main: css`
      display: inline-flex;
      flex: 1 0 auto;
      flex-direction: column;
      gap: 0.25rem;
      background-color: ${theme.colors.background};
      min-width: 8rem;
    `,

    selectBox: css`
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.9375rem;
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
  };

  return styles;
};

export default getStaticSelectStyles;
