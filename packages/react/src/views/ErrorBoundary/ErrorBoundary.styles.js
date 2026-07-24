import { css } from '@emotion/react';

export const styles = {
  errorContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    text-align: center;
    background-color: inherit;
    color: inherit;
  `,
  icon: css`
    margin-bottom: 1rem;
  `,
  heading: css`
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  `,
  text: css`
    margin-bottom: 1.5rem;
    opacity: 0.8;
  `,
  buttons: css`
    display: flex;
    gap: 1rem;
  `,
};
