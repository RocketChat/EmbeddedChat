import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import getTooltipStyles from './Tooltip.styles';
import { useTheme } from '../../hooks';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const { theme } = useTheme();
  const styles = getTooltipStyles(theme, position);

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
