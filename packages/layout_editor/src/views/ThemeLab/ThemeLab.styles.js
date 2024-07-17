import { css } from '@emotion/react';

export const useThemeLabStyles = ({ colors }) => {
  const styles = {
    sectionContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-around;
    `,

    section: css`
      padding: 0 1rem 0.5rem;
      cursor: pointer;
    `,
    sectionActive: css`
      border-bottom: 1px solid ${colors.primary};
    `,
  };

  return styles;
};
