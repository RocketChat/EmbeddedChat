import { css } from '@emotion/react';

export const getDemoSidebarStyles = () => {
  const styles = {
    container: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow: auto;
      width: 100%;
      justify-content: space-between;
      padding: 0 1rem 1rem;
    `,

    itemContainer: css`
      width: 100%;
      padding-bottom: 8px;
      padding-top: 8px;
      display: flex;
      align-items: center;
    `,

    icon: css`
      padding: 0.125em;
      margin-right: 0.5rem;
      align-self: center;
    `,

    btn: css`
      width: 100%;
      opacity: 1;
      transition: all 0.1s;
    `,

    btnInvisible: css`
      width: 0;
      opacity: 0;
    `,
  };

  return styles;
};
