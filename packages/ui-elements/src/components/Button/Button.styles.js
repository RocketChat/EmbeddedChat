import { css } from '@emotion/react';
import { useTheme } from '../../hooks/useTheme';

const getSquareSize = (size) => {
  if (size === 'small') {
    return '1.25rem';
  }
  if (size === 'large') {
    return '2.75rem';
  }
  return '2rem';
};

const useButtonStyles = (type, size) => {
  const { theme, colors } = useTheme();

  const main = css`
    cursor: pointer;
    display: inline-block;
    background-color: ${colors[type] || 'currentColor'};
    color: ${colors[`${type}Foreground`] || 'currentColor'};
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
    border-radius: ${theme.schemes.radius};
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
      background-color: ${colors.muted};
      color: ${colors.mutedForeground};
      border: none;
      cursor: not-allowed;
    }
    &.ghost {
      background: none;
      color: ${colors[`${type}`] || colors.accentForeground};
      border: none;
    }
    &.disabled.ghost {
      color: ${colors.mutedForeground};
      border: none;
      background: none;
      cursor: not-allowed;
    }
    &.ghost:not(.disabled):hover {
      background: ${colors.accent};
    }
  `;

  return { main };
};

export default useButtonStyles;
