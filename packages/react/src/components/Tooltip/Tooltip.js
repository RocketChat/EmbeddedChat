import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import useToolTipStyles from './Tooltip.styles';

const Tooltip = ({ children, text, position }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const styles = useToolTipStyles(position);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  let touchTimer;

  const handleTouchStart = () => {
    touchTimer = setTimeout(() => {
      setTooltipVisible(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer);
    setTooltipVisible(false);
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      css={css`
        position: relative;
        display: inline-block;
      `}
    >
      {children}
      {isTooltipVisible && (
        <Box css={styles.tooltip}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
          <Box css={styles.tooltipArrow} />
        </Box>
      )}
    </Box>
  );
};

export default Tooltip;
