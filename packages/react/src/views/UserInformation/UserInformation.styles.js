import { css } from '@emotion/react';

const styles = {
  userSidebar: css`
    padding: 0 1rem 1rem;
    margin: 0 auto;
  `,

  roleContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
  `,

  userRole: css`
    background-color: #cbced1;
    letter-spacing: 0rem;
    font-size: 0.75rem;
    padding: 0 0.25rem;
    margin: 0 0.1rem;
    border-radius: 2px;
    font-weight: 700;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #2f343d;
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
    color: #4a4a4a;
  `,
};

export default styles;
