import { css } from '@emotion/react';
import { useTheme } from '../../hooks/useTheme';

const useStaticSelectStyles = () => {
  const { theme, colors } = useTheme();
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
  };

  return styles;
};

export default useStaticSelectStyles;
