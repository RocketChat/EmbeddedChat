import { css } from '@emotion/react';

export const getAIComposerStyles = (theme) => ({
  wrapper: css`
    position: fixed;
    z-index: 1301;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.1rem;
    padding: 0.2rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    background: ${theme.colors.card};
    box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.14);
  `,
  actionButton: css`
    border: 0;
    border-radius: calc(${theme.radius} - 2px);
    padding: 0.3rem 0.5rem;
    background: transparent;
    color: ${theme.colors.foreground};
    cursor: pointer;
    font-size: 0.75rem;
    &:hover,
    &:focus-visible {
      background: ${theme.colors.muted};
      outline: none;
    }
  `,
});
