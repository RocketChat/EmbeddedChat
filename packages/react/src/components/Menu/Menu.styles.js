import { css } from '@emotion/react';
import { lighten, darken } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const useMenuStyles = () => {
  const { theme, colors } = useCustomTheme();

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
    z-index: ${theme.zIndex.menu};
    border-radius: 0.2em;
    padding: 0.5rem 0;
    box-shadow: ${theme.shadows[1]};
    background-color: ${colors.background};
  `;

  return { wrapper, container };
};

export const useMenuItemStyles = () => {
  const { mode, colors } = useCustomTheme();

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
