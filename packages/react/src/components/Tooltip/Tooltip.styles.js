import { css } from '@emotion/react';

const styles = {
  tooltip: (position) => css`
    position: absolute;
    left: 64%;
    transform: translateX(-50%);
    background-color: rgba(97, 97, 97, 1);
    color: white;
    padding: 4px;
    border-radius: 3px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    font-size: 12.5px;
    white-space: nowrap;
    font-family: sans-serif;
    top: ${position === 'top' ? 'calc(-100% - 10px)' : '100%'};
  `,
  tooltipArrow: (position) => css`
    content: '';
    position: absolute;
    left: 50%;
    margin-left: -5px;
    border-width: 6px;
    border-style: solid;
    border-color: rgba(97, 97, 97, 1) transparent transparent transparent;
    top: ${position === 'top' ? '100%' : 'auto'};
    bottom: ${position === 'bottom' ? '100%' : 'auto'};
    transform: ${position === 'bottom'
      ? 'translateX(-50%) rotate(180deg)'
      : 'translateX(-50%)'};
  `,
};

export default styles;
