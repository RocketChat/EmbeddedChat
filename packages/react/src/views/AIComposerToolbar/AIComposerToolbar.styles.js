import { css } from '@emotion/react';

export const getAIComposerStyles = (theme) => ({
  wrapper: css`
    position: relative;
    margin: 0 2rem;
  `,

  toolbar: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    padding: 0.35rem 0.5rem;
    background: ${theme.colors.card};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    animation: ec-ai-fadein 0.12s ease;
    @keyframes ec-ai-fadein {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,

  toolbarLabel: css`
    font-size: 0.65rem;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
    white-space: nowrap;
  `,

  actionRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
  `,

  divider: css`
    display: block;
    width: 100%;
    height: 1px;
    background: ${theme.colors.border};
    margin: 0.15rem 0;
  `,

  actionBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.55rem;
    border-radius: 0.375rem;
    border: 1px solid ${theme.colors.border};
    background: transparent;
    color: ${theme.colors.foreground};
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    white-space: nowrap;
    &:hover {
      background: ${theme.colors.primary};
      color: ${theme.colors.primaryForeground};
      border-color: ${theme.colors.primary};
    }
  `,

  processingRow: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: ${theme.colors.mutedForeground};
    padding: 0.3rem 0.5rem;
  `,

  processingDot: css`
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${theme.colors.primary};
    display: inline-block;
    animation: ec-pulse 1s infinite;
    @keyframes ec-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.25;
      }
    }
  `,

  suggestionBox: css`
    background: ${theme.colors.card};
    border: 1px solid ${theme.colors.primary};
    border-radius: ${theme.radius};
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${theme.colors.foreground};
    animation: ec-ai-fadein 0.15s ease;
  `,

  suggestionHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
  `,

  suggestionLabel: css`
    font-size: 0.68rem;
    font-weight: 600;
    color: ${theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,

  suggestionActions: css`
    display: flex;
    gap: 0.3rem;
  `,

  acceptBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 0.375rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    border: none;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      opacity: 0.9;
    }
  `,

  rejectBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border-radius: 0.375rem;
    background: transparent;
    color: ${theme.colors.mutedForeground};
    border: 1px solid ${theme.colors.border};
    cursor: pointer;
    &:hover {
      background: ${theme.colors.muted};
      color: ${theme.colors.foreground};
    }
  `,

  suggestionText: css`
    white-space: pre-wrap;
    word-break: break-word;
  `,

  originalLabel: css`
    font-size: 0.68rem;
    color: ${theme.colors.mutedForeground};
    margin-top: 0.35rem;
    font-style: italic;
  `,
});
