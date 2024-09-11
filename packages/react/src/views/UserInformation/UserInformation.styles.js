import { css } from '@emotion/react';

const getUserInformationStyles = (theme) => {
  const styles = {
    userSidebar: css`
      padding: 0 1rem 1rem;
      margin: 0 auto;
      overflow: auto;
    `,

    roleContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      width: 100%;
    `,

    userRole: css`
      letter-spacing: 0rem;
      font-size: 0.75rem;
      padding: 0 0.25rem;
      margin: 0 0.1rem;
      border-radius: ${theme.radius};
      font-weight: 700;
      line-height: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-color: ${theme.colors.secondary};
    `,

    emailContainer: css`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-block: 5px;
    `,

    centeredColumnStyles: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
  };

  return styles;
};

export default getUserInformationStyles;
