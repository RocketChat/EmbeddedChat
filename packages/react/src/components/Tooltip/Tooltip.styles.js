import { css } from '@emotion/react';

const styles = {
  tooltip: (position) => css`
    position: absolute;
    left: 64%;
    background-color: rgba(97, 97, 97, 1);
    color: white;
    padding: 4px;
    border-radius: 3px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    font-size: 12.5px;
    white-space: nowrap;
    font-family: sans-serif;
    ${position === 'top' ? 'top: calc(-100% - 10px);' : 'top: 100%;'}
  `,
  tooltipArrow: (position) => css`
    position: absolute;
    left: 50%;
    margin-left: -5px;
    border-width: 6px;
    border-style: solid;
    border-color: rgba(97, 97, 97, 1) transparent transparent transparent;
    ${position === 'top'
      ? 'top: 100%; transform: translateX(-50%);'
      : 'bottom: 100%; transform: translateX(-50%) rotate(180deg);'}
  `,
};

export default styles;
