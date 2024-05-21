import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

const useTooltipStyles = (position) => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const invertColors = theme.schemes[invertMode(mode)];

  const tooltip = css`
    position: absolute;
    left: 64%;
    transform: translateX(-50%);
    background-color: ${invertColors.secondary};
    color: ${invertColors.secondaryForeground};
    padding: 8.5px;
    border-radius: 3px;
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
    border-color: ${invertColors.secondary} transparent transparent transparent;
    top: ${position === 'top' ? '100%' : 'auto'};
    bottom: ${position === 'bottom' ? '100%' : 'auto'};
    transform: ${position === 'bottom'
      ? 'translateX(-50%) rotate(180deg)'
      : 'translateX(-50%)'};
  `;

  return { tooltip, tooltipArrow };
};

export default useTooltipStyles;
