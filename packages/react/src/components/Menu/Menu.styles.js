import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

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
    z-index: 1100;
    border-radius: 0.2em;
    padding: 0.2em 0;
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
    padding: 0.25em;
    white-space: nowrap;
    gap: 0.2rem;
    color: ${colors.accentForeground};
    &:hover {
      background-color: ${colors.accentBackground};
      cursor: pointer;
    }
  `;

  const disabled = css`
    cursor: not-allowed !important;
    color: ${theme.palette?.grey?.contrastText || '#6F7E8C'};
  `;

  return { item, disabled };
};
