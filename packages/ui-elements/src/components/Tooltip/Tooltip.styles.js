import { css } from '@emotion/react';

const getTooltipStyles = (theme, position = 'top') => {
  const isBottom = position === 'bottom' || position === 'down';

  const styles = {
    tooltip: css`
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${theme.invertedColors.secondary};
      color: ${theme.invertedColors.secondaryForeground};
      padding: 8.5px;
      border-radius: ${theme.radius};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: ${theme.zIndex?.tooltip || 1400};
      font-size: 12.5px;
      font-weight: 500;
      white-space: nowrap;
      font-family: sans-serif;
      pointer-events: none;
      ${isBottom
        ? css`
            top: calc(100% + 8px);
          `
        : css`
            bottom: calc(100% + 8px);
          `}
    `,
    tooltipArrow: css`
      content: '';
      position: absolute;
      left: 50%;
      border-width: 6px;
      border-style: solid;
      border-color: ${theme.invertedColors.secondary} transparent transparent
        transparent;
      ${isBottom
        ? css`
            bottom: 100%;
            transform: translateX(-50%) rotate(180deg);
          `
        : css`
            top: 100%;
            transform: translateX(-50%);
          `}
    `,
  };

  return styles;
};

export default getTooltipStyles;
