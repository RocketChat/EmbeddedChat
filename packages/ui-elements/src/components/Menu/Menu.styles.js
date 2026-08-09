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

    backdrop: css`
      position: fixed;
      inset: 0;
      z-index: ${theme.zIndex?.menu || 1300};
      background: transparent;
    `,

    backdropInContainer: css`
      position: absolute;
      inset: 0;
      z-index: ${theme.zIndex?.menu || 1300};
      background: transparent;
    `,

    sheet: css`
      position: fixed;
      left: 0.5rem;
      right: 0.5rem;
      bottom: 0.5rem;
      display: flex;
      flex-direction: column;
      max-height: min(70vh, calc(100vh - 6rem));
      overflow-y: auto;
      z-index: ${(theme.zIndex?.menu || 1300) + 1};
      border-radius: 0.75rem;
      padding: 0.75rem 0;
      background-color: ${theme.colors.background};
    `,

    sheetInContainer: css`
      position: absolute;
    `,
  };

  return styles;
};

export const getMenuItemStyles = ({ theme, mode }) => {
  const styles = {
    item: css`
      font-size: 14px;
      font-family: inherit;
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
      font-size: 14px;
      font-family: inherit;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      width: 100%;
      white-space: nowrap;
      color: ${theme.colors.foreground};
      text-align: left;
      border: 0;
      background: transparent;
      &:hover {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.05)
          : lighten(theme.colors.background, 2)};
        cursor: pointer;
      }
      & + & {
        border-top: 1px solid ${theme.colors.border};
      }
    `,

    disabled: css`
      cursor: not-allowed !important;
      color: ${theme.colors.mutedForeground};
    `,
  };

  return styles;
};
