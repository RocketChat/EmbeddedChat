import { css } from '@emotion/react';

const getTooltipStyles = (theme, position) => {
  const styles = {
    tooltip: css`
      position: absolute;
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
      top: ${position === 'top'
        ? 'calc(-100% - 20px)'
        : position === 'bottom'
        ? 'calc(100% + 10px)'
        : '50%'};
      left: ${position === 'left'
        ? 'calc(-100% - 80px)'
        : position === 'right'
        ? 'calc(100% + 10px)'
        : '64%'};
      transform: ${position === 'top'
        ? 'translateX(-50%)'
        : position === 'bottom'
        ? 'translateX(-50%)'
        : position === 'left' || position === 'right'
        ? 'translateY(-50%)'
        : 'auto'};
    `,

    tooltipArrow: css`
      content: '';
      position: absolute;
      margin-left: -4px;
      border-width: 6px;
      border-style: solid;
      border-color: ${theme.invertedColors.secondary} transparent transparent
        transparent;
      top: ${position === 'top'
        ? '100%'
        : position === 'bottom'
        ? 'auto'
        : '50%'};
      bottom: ${position === 'bottom' ? '100%' : 'auto'};
      left: ${position === 'left'
        ? '102%'
        : position === 'right'
        ? '-7px'
        : '50%'};
      transform: ${position === 'bottom'
        ? 'translateX(-50%) rotate(180deg)'
        : position === 'right'
        ? 'translateY(-50%) rotate(90deg)'
        : position === 'left'
        ? 'translateY(-50%) rotate(-90deg)'
        : 'translateX(-50%)'};
    `,
  };

  return styles;
};

export default getTooltipStyles;
