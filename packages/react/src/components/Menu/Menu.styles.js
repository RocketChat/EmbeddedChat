import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';
import { lighten, darken } from '../../lib/color';

export const useMenuStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const wrapper = css`
    position: relative;
    display: inline-block;
  `;

  const container = css`
    position: absolute;
    top: 100%;
    right: 0;
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    z-index: ${theme.zIndex.menu};
    border-radius: 0.2em;
    padding: 0.5em 0;
    box-shadow: ${theme.shadows[1]};
    background-color: ${colors.background};
  `;

  return { wrapper, container };
};

export const useMenuItemStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const item = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.25em 0.75em;
    white-space: nowrap;
    gap: 0.2rem;
    color: ${colors.foreground};
    &:hover {
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.05)
        : lighten(colors.background, 2)};
      cursor: pointer;
    }
  `;

  const disabled = css`
    cursor: not-allowed !important;
    color: ${colors.mutedForeground};
  `;

  return { item, disabled };
};
