import { css } from '@emotion/react';

const getTooltipStyles = (theme, position = 'top') => {
  const positionMap = {
    top: {
      top: 'calc(-100% - 20px)',
      left: '50%',
      transform: 'translateX(-50%)',
      arrowTop: '100%',
      arrowLeft: '50%',
      arrowTransform: 'translateX(-50%) rotate(0deg)',
    },
    bottom: {
      top: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      arrowTop: 'auto',
      arrowLeft: '50%',
      arrowTransform: 'translateX(-50%) rotate(180deg)',
    },
    left: {
      top: '50%',
      left: 'calc(-100% - 80px)',
      transform: 'translateY(-50%)',
      arrowTop: '50%',
      arrowLeft: '102%',
      arrowTransform: 'translateY(-50%) rotate(-90deg)',
    },
    right: {
      top: '50%',
      left: 'calc(100% + 10px)',
      transform: 'translateY(-50%)',
      arrowTop: '50%',
      arrowLeft: '-7px',
      arrowTransform: 'translateY(-50%) rotate(90deg)',
    },
    center: {
      top: '50%',
      left: '64%',
      transform: 'auto',
      arrowTop: 'auto',
      arrowLeft: '50%',
      arrowTransform: 'translateX(-50%)',
    },
  };

  const positionStyles = positionMap[position] || positionMap.top;

  return {
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
      top: ${positionStyles.top};
      left: ${positionStyles.left};
      transform: ${positionStyles.transform};
    `,

    tooltipArrow: css`
      content: '';
      position: absolute;
      margin-left: -4px;
      border-width: 6px;
      border-style: solid;
      border-color: ${theme.invertedColors.secondary} transparent transparent
        transparent;
      top: ${positionStyles.arrowTop};
      bottom: ${positionStyles.arrowTop === 'auto' ? '100%' : 'auto'};
      left: ${positionStyles.arrowLeft};
      transform: ${positionStyles.arrowTransform};
    `,
  };
};

export default getTooltipStyles;
