import { css } from '@emotion/react';

const getSquareSize = (size) => {
  if (size === 'small') {
    return '1.25rem';
  }
  if (size === 'large') {
    return '2.75rem';
  }
  return '2rem';
};

const getButtonStyles = (theme) => {
  const styles = {
    main: (type, size) => css`
      cursor: pointer;
      display: inline-block;
      background-color: ${theme.colors[type] || 'currentColor'};
      color: ${theme.colors[`${type}Foreground`] || 'currentColor'};
      border: none;
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
      align-self: flex-start;
      border-radius: ${theme.radius};
      &.ec-button--small {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1rem;
        min-width: 56px;
        padding-block: calc(12px - 0.5rem);
        padding: calc(12px - 0.5rem) 6px;
        padding-inline: 6px;
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
        background-color: ${theme.colors.muted};
        color: ${theme.colors.mutedForeground};
        border: none;
        cursor: not-allowed;
      }
      &.ghost {
        background: none;
        color: ${theme.colors[`${type}`] || theme.colors.accentForeground};
        border: none;
      }
      &.disabled.ghost {
        color: ${theme.colors.mutedForeground};
        border: none;
        background: none;
        cursor: not-allowed;
      }
      &.ghost:not(.disabled):hover {
        background: ${theme.colors.accent};
      }
    `,
  };

  return styles;
};

export default getButtonStyles;
