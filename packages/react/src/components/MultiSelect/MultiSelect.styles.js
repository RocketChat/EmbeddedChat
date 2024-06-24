import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useMultiSelectStyles = () => {
  const { theme, colors } = useCustomTheme();
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
      padding: 0.5rem 0.9375rem;
      background-color: transparent;
      letter-spacing: 0rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      color: ${colors.foreground};
      border-width: 1px;
      border-color: ${colors.border};
      border-style: solid;
      border-radius: ${theme.schemes.radius};
      background-color: ${colors.background};
    `,

    clickStyle: css`
      border-color: ${colors.ring};
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${colors.mutedForeground};
    `,
    selectedItemsContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    `,
    selectedItems: css`
      background: ${colors.muted};
      padding: 0.2rem;
      display: flex;
      justify-self: flex-start;
      gap: 0.2rem;
    `,
  };

  return styles;
};

export default useMultiSelectStyles;
