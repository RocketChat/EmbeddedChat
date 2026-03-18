import { css } from '@emotion/react';
import { lighten, darken } from '../../lib/color';

export const getMenuStyles = (theme) => {
  const { theme: currentTheme, mode } = theme;
  const surfaceColor =
    mode === 'light'
      ? currentTheme.colors.background
      : lighten(currentTheme.colors.background, 1.25);
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
      width: max-content;
      min-width: 220px;
      height: fit-content;
      z-index: ${currentTheme.zIndex?.menu || 1300};
      border-radius: 0.5rem;
      padding: 0.5rem 0;
      border: 1px solid ${currentTheme.colors.border};
      box-shadow: ${currentTheme.shadows[2]};
      background-color: ${surfaceColor};
    `,

    backdrop: css`
      position: fixed;
      inset: 0;
      z-index: ${(currentTheme.zIndex?.menu || 1300) - 1};
      background: rgba(0, 0, 0, 0.42);
      animation: ec-fade-in 0.18s ease;
      @keyframes ec-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `,

    sheet: css`
      position: fixed;
      bottom: 0;
      left: 0.5rem;
      right: 0.5rem;
      z-index: ${currentTheme.zIndex?.menu || 1300};
      background-color: ${surfaceColor};
      color: ${currentTheme.colors.foreground};
      border: 1px solid ${currentTheme.colors.border};
      border-bottom: none;
      border-radius: 0.75rem 0.75rem 0 0;
      box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.28);
      max-height: min(72vh, calc(100vh - 5.5rem));
      overflow-y: auto;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      overscroll-behavior: contain;
      animation: ec-slide-up 0.22s cubic-bezier(0.32, 0.72, 0, 1);
      @keyframes ec-slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `,

    section: css`
      padding-block: 0.25rem;

      & + & {
        border-top: 1px solid ${currentTheme.colors.border};
      }
    `,

    sectionTitle: css`
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: ${currentTheme.colors.mutedForeground};
      padding: 0.25rem 1rem 0.5rem;
    `,
  };

  return styles;
};

export const getMenuItemStyles = ({ theme, mode }) => {
  const styles = {
    item: css`
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui,
        sans-serif;
      font-size: 0.9375rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0.625rem 1rem;
      white-space: nowrap;
      gap: 0.75rem;
      color: ${theme.colors.foreground};
      line-height: 1.25rem;
      transition: background-color 0.15s ease;
      &:hover {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.04)
          : lighten(theme.colors.background, 2.25)};
        cursor: pointer;
      }
    `,

    itemMobile: css`
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui,
        sans-serif;
      font-size: 0.9375rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem 1rem;
      min-height: 2.25rem;
      gap: 0.75rem;
      color: ${theme.colors.foreground};
      line-height: 1.25rem;
      transition: background-color 0.15s ease;
      &:active {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.04)
          : lighten(theme.colors.background, 2.25)};
      }
    `,

    destructive: css`
      color: ${theme.colors.destructive};
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${theme.colors.mutedForeground};
    `,
  };

  return styles;
};
