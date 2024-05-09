import { css } from '@emotion/react';

const styles = {
  messageContainer: css`
    margin: 1.25rem 0.5rem 0.25rem 0.5rem;
    position: relative;
    font-size: 0.85rem;
    background-color: #f2f3f5;
    padding: 0.5rem;
    z-index: 100;
    border: 0.5px solid currentColor;
    border-radius: 0.15rem;
  `,

  avatarContainer: css`
    padding: 0.25rem;
    display: flex;
    gap: 0.5rem;
  `,

  message: css`
    padding: 0.25rem;
  `,

  actionBtn: css`
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
  `,
};

export default styles;
