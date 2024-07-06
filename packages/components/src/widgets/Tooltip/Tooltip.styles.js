import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useTooltipStyles = (position) => {
  const { theme, invertedColors } = useCustomTheme();
  const tooltip = css`
    position: absolute;
    left: 64%;
    transform: translateX(-50%);
    background-color: ${invertedColors.secondary};
    color: ${invertedColors.secondaryForeground};
    padding: 8.5px;
    border-radius: ${theme.schemes.radius};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: ${theme.zIndex.tooltip};
    font-size: 12.5px;
    font-weight: 500;
    white-space: nowrap;
    font-family: sans-serif;
    top: ${position === 'top' ? 'calc(-100% - 20px)' : 'calc(100% + 10px)'};
  `;
  const tooltipArrow = css`
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -4px;
    border-width: 6px;
    border-style: solid;
    border-color: ${invertedColors.secondary} transparent transparent
      transparent;
    top: ${position === 'top' ? '100%' : 'auto'};
    bottom: ${position === 'bottom' ? '100%' : 'auto'};
    transform: ${position === 'bottom'
      ? 'translateX(-50%) rotate(180deg)'
      : 'translateX(-50%)'};
  `;

  return { tooltip, tooltipArrow };
};

export default useTooltipStyles;
