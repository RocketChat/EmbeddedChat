import { css } from '@emotion/react';
import { lighten, darken } from '../../lib/color';
import useTheme from '../../hooks/useTheme';

export const useMenuStyles = () => {
  const { theme } = useTheme();

  const wrapper = css`
    position: relative;
  `;

  const container = css`
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
  `;

  return { wrapper, container };
};

export const useMenuItemStyles = () => {
  const { theme, mode } = useTheme();

  const item = css`
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
  `;

  const disabled = css`
    cursor: not-allowed !important;
    color: ${theme.colors.mutedForeground};
  `;

  return { item, disabled };
};
