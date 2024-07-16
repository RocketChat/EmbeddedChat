import { css } from "@emotion/react";

export const getDemoSidebarStyles = () => {
  const styles = {
    container: css`
      display: flex;
      flex-direction: column;
      overflow: auto;
      width: 100%;
      align-items: center;
      justify-content: center;
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
  };

  return styles;
};
