import { css } from '@emotion/react';

export const getReactionDetailsModalStyles = (theme) => ({
  modalDialog: css`
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    padding: 0;
  `,
  headerContent: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `,
  tabList: css`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    overflow-x: auto;
    padding: 0.4rem 0.6rem 0.6rem;
    border-bottom: 1px solid ${theme.colors.border};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.border};
      border-radius: 4px;
    }
  `,
  tabButton: (isActive) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    background: ${isActive ? theme.colors.secondary : 'transparent'};
    color: ${isActive ? theme.colors.foreground : theme.colors.mutedForeground};
    border: 1px solid ${isActive ? theme.colors.primary : theme.colors.border};
    transition: all 0.15s ease-in-out;
    white-space: nowrap;
    outline: none;

    img.joypixels {
      height: 1em;
      width: 1em;
    }

    &:hover {
      background: ${theme.colors.secondary};
      color: ${theme.colors.foreground};
    }
  `,
  reactorsList: css`
    max-height: 280px;
    overflow-y: auto;
    padding: 0.5rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  `,
  reactorRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.5rem;
    border-radius: ${theme.radius};
    transition: background 0.15s ease-in-out;

    &:hover {
      background: ${theme.colors.secondary};
    }
  `,
  userSection: css`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
  `,
  userInfo: css`
    display: flex;
    flex-direction: column;
    min-width: 0;
  `,
  nameContainer: css`
    display: flex;
    align-items: center;
    gap: 0.35rem;
  `,
  displayName: css`
    font-weight: 600;
    font-size: 0.875rem;
    color: ${theme.colors.foreground};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  username: css`
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  youBadge: css`
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: ${theme.colors.secondary};
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.border};
  `,
  actionSection: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  `,
  emojiBadge: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;

    img.joypixels {
      height: 1.1em;
      width: 1.1em;
    }
  `,
  emptyState: css`
    text-align: center;
    padding: 1.5rem 0.5rem;
    color: ${theme.colors.mutedForeground};
    font-size: 0.85rem;
  `,
});
