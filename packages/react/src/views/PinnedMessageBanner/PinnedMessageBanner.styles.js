import { css } from '@emotion/react';
import { alpha } from '@embeddedchat/ui-elements';

const getPinnedMessageBannerStyles = (theme, mode) => {
  const isDark = mode === 'dark';

  return {
    bannerContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      min-height: 40px;
      box-sizing: border-box;
      background-color: ${isDark
        ? alpha(theme.colors.muted || theme.colors.secondary, 0.7)
        : alpha(theme.colors.muted || theme.colors.secondary, 0.85)};
      border-bottom: 1px solid ${theme.colors.border};
      color: ${theme.colors.foreground};
      font-size: 0.85rem;
      position: relative;
      z-index: 20;
      user-select: none;
      transition: background-color 0.2s ease;
    `,

    contentWrapper: css`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      min-width: 0;
      cursor: pointer;
      padding: 0.2rem 0.35rem;
      border-radius: ${theme.radius};
      transition: background-color 0.15s ease;

      &:hover {
        background-color: ${alpha(theme.colors.primary, 0.08)};
      }
    `,

    pinIcon: css`
      color: ${theme.colors.primary};
      flex-shrink: 0;
      display: flex;
      align-items: center;
    `,

    textContainer: css`
      display: flex;
      align-items: center;
      gap: 0.35rem;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1;
    `,

    author: css`
      font-weight: 600;
      color: ${theme.colors.foreground};
      flex-shrink: 0;
    `,

    snippet: css`
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: ${theme.colors.mutedForeground || theme.colors.foreground};
      font-weight: 400;
    `,

    actionsContainer: css`
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
    `,

    counter: css`
      font-size: 0.75rem;
      font-weight: 500;
      color: ${theme.colors.mutedForeground};
      padding: 0 0.25rem;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    `,
  };
};

export default getPinnedMessageBannerStyles;
