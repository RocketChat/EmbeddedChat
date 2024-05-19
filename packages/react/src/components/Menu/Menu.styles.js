import { css } from '@emotion/react';
import { alpha } from '../../lib/color';

export const MenuStyles = {
  wrapper: css`
    position: relative;
    display: inline-block;
  `,

  container: css`
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
    background-color: #fff;
  `,
};

export const MenuItemStyles = {
  item: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0.25em;
    white-space: nowrap;
    gap: 0.2rem;
  `,

  themed: (theme, color) => css`
    color: ${theme.palette?.[color]?.main || color};
    &:hover {
      background-color: ${theme.palette?.grey?.main || '#E7EBF0'};
      ${theme.palette?.[color]?.main || color
        ? `background-color: ${alpha(
            theme.palette?.[color]?.main || color,
            0.075
          )}`
        : ''};
      cursor: pointer;
    }
  `,
  disabled: (theme) => css`
    cursor: not-allowed !important;
    color: ${theme.palette?.grey?.contrastText || '#6F7E8C'};
  `,
};
