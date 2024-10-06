import { css } from '@emotion/react';

const getListBoxStyles = (theme) => {
  const styles = {
    main: css`
      overflow: auto;
      overflow-x: hidden;
      max-height: 145px;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.2rem;
      color: ${theme.colors.secondaryForeground};
    `,

    listItem: css`
    cursor: pointer;
    display: flex;theme.
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;

    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `,

    listText: css`
      font-weight: 600;
    `,

    checkContainer: css`
      padding: 0.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    `,

    checkbox: css`
      cursor: pointer;
    `,
  };

  return styles;
};

export default getListBoxStyles;
