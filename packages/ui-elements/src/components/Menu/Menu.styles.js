import { css } from '@emotion/react';
import { lighten, darken } from '../../lib/color';

export const getMenuStyles = (theme) => {
  const styles = {
    wrapper: css`
      position: relative;
    `,

    container: css`
      position: absolute;
      top: 100%;
      right: 0;
      display: flex;
      flex-direction: column;
      width: fit-content;
      height: fit-content;
      z-index: ${theme.zIndex?.menu || 1300};
      border-radius: 0.2em;
      padding: 0.5rem 0;
      box-shadow: ${theme.shadows[1]};
      background-color: ${theme.colors.background};
    `,

    // ── Mobile bottom sheet ────────────────────────────────────────────────
    backdrop: css`
      position: fixed;
      inset: 0;
      z-index: ${(theme.zIndex?.menu || 1300) - 1};
      background: rgba(0, 0, 0, 0.45);
      animation: ec-fade-in 0.18s ease;
      @keyframes ec-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
    `,

    sheet: css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: ${theme.zIndex?.menu || 1300};
      background-color: ${theme.colors.background};
      border-radius: 14px 14px 0 0;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.18);
      padding-bottom: env(safe-area-inset-bottom, 0px);
      animation: ec-slide-up 0.22s cubic-bezier(0.32, 0.72, 0, 1);
      @keyframes ec-slide-up {
        from { transform: translateY(100%); }
        to   { transform: translateY(0); }
      }
    `,

    sheetHandle: css`
      display: flex;
      justify-content: center;
      padding: 10px 0 4px;
    `,

    sheetHandleBar: css`
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background-color: ${theme.colors.mutedForeground || '#ccc'};
      opacity: 0.5;
    `,
  };

  return styles;
};

export const getMenuItemStyles = ({ theme, mode }) => {
  const styles = {
    item: css`
      font-size: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0.25em 0.75em;
      white-space: nowrap;
      gap: 0.2rem;
      color: ${theme.colors.foreground};
      &:hover {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.05)
          : lighten(theme.colors.background, 2)};
        cursor: pointer;
      }
    `,

    itemMobile: css`
      font-size: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0 1.25rem;
      min-height: 56px;
      gap: 0.85rem;
      color: ${theme.colors.foreground};
      border-bottom: 1px solid ${theme.colors.border || 'rgba(0,0,0,0.07)'};
      &:last-of-type {
        border-bottom: none;
      }
      &:active {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.05)
          : lighten(theme.colors.background, 2)};
      }
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${theme.colors.mutedForeground};
    `,
  };

  return styles;
};
