import { css } from '@emotion/react';

const getMemberListStyles = (theme) => {
  const styles = {
    main: css`
      margin: 0.2rem 2rem;
      display: block;
      overflow: auto;
      max-height: 10rem;
      overflow-x: hidden;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.2rem;
      color: ${theme.colors.secondaryForeground};
    `,

    listItem: css`
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.1rem 0.25rem;

      &:hover {
        background-color: ${theme.colors.secondary};
      }
    `,

    listText: css`
      font-weight: 600;
    `,
  };

  return styles;
};

export default getMemberListStyles;
