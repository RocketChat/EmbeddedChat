import { css } from '@emotion/react';

const getTooltipStyles = (theme, position) => {
  const styles = {
    tooltip: css`
      position: absolute;
      left: 64%;
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
      top: ${position === 'top' ? 'calc(-100% - 20px)' : 'calc(100% + 10px)'};
    `,
    tooltipArrow: css`
      content: '';
      position: absolute;
      left: 50%;
      margin-left: -4px;
      border-width: 6px;
      border-style: solid;
      border-color: ${theme.invertedColors.secondary} transparent transparent
        transparent;
      top: ${position === 'top' ? '100%' : 'auto'};
      bottom: ${position === 'bottom' ? '100%' : 'auto'};
      transform: ${position === 'bottom'
        ? 'translateX(-50%) rotate(180deg)'
        : 'translateX(-50%)'};
    `,
  };

  return styles;
};

export default getTooltipStyles;
