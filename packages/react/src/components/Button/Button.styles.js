import { css, useTheme } from '@emotion/react';
import { useUserStore } from '../../store';

const ButtonStyles = (color, size, getSquareSize) => {
  const theme = useTheme();
  const dark = useUserStore((state) => state.dark);
  const mode = dark ? 'dark' : 'light';

  return css`
    cursor: pointer;
    display: inline-block;
    background-color: ${theme.schemes[mode][color] || 'currentColor'};
    color: ${theme.schemes[mode][`${color}Foreground`] || 'currentColor'};
    border-color: ${theme.schemes[mode].border || 'currentColor'};
    border-style: solid;
    border-width: 1px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.25rem;
    min-width: 80px;
    outline: none;
    overflow: hidden;
    padding-block: calc(18px - 0.625rem);
    padding: calc(18px - 0.625rem) 14px;
    padding-inline: 14px;
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 0.25rem;
    align-self: flex-start;
    &.ec-button--small {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0;
      line-height: 1rem;
      min-width: 56px;
      padding-block: calc(12px - 0.5rem);
      padding: calc(12px - 0.5rem) 6px;
      padding-inline: 6px;
      border-radius: 0.25rem;
    }
    &.ec-button--large {
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.5rem;
      min-width: 96px;
      padding-block: calc(22px - 0.75rem);
      padding: calc(22px - 0.75rem) 22px;
      padding-inline: 22px;
      border-radius: 0.36rem;
    }

    &.ec-button-square {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${getSquareSize(size)};
      min-width: ${getSquareSize(size)};
      height: ${getSquareSize(size)};
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }

    &:hover {
      filter: brightness(90%);
    }

    &.disabled:not(.ghost):hover {
      filter: none;
    }

    &.disabled:not(.ghost) {
      background-color: ${theme.schemes[mode].muted};
      color: ${theme.schemes[mode].mutedForeground};
      border: none;
    }
    &.ghost {
      background: none;
      color: ${theme.schemes[mode].accentForeground};
      border: none;
    }
    &.disabled.ghost {
      color: ${theme.schemes[mode].mutedForeground};
      border: none;
      background: none;
    }
    &.ghost:not(.disabled):hover {
      background: ${theme.schemes[mode].accent};
    }
  `;
};

export default ButtonStyles;
