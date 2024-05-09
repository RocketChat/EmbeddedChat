import { css } from '@emotion/react';

const styles = {
  button: (theme, color, size, getSquareSize) => css`
    cursor: pointer;
    display: inline-block;
    background-color: ${theme.palette[color]?.main};
    color: ${theme.palette[color]?.contrastText || 'currentColor'};
    border-color: ${theme.palette[color]?.main || 'currentColor'};
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
    &:hover {
      filter: brightness(90%);
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
    &.disabled:not(.ghost) {
      background: ${theme?.palette?.secondary?.main || '#e4e7ea'};
      border: none;
      color: ${theme?.palette?.secondary?.contrastText || '#000'};
    }
    &.ghost {
      background: none;
      color: ${theme?.palette?.[color]?.main || 'currentColor'};
      border: none;
    }
    &.disabled.ghost {
      color: ${theme?.palette?.secondary?.main || '#e4e7ea'};
      border: none;
      background: none;
    }
    &.ghost:not(.disabled):hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `,
};

export default styles;
