import React, { useState, useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import getToolTipStyles from './Tooltip.styles';
import { useTheme } from '../../hooks';

const Tooltip = ({
  children,
  text,
  position = 'top',
  className = '',
  style = {},
  ...props
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const touchTimerRef = useRef(null);
  const { theme } = useTheme();
  const styles = getToolTipStyles(theme, position);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleFocus = () => {
    setTooltipVisible(true);
  };

  const handleBlur = () => {
    setTooltipVisible(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setTooltipVisible(false);
    }
  };

  const handleTouchStart = () => {
    touchTimerRef.current = setTimeout(() => {
      setTooltipVisible(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    setTooltipVisible(false);
  };

  useEffect(
    () => () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    },
    []
  );

  const hasText = Boolean(
    text && (typeof text === 'string' ? text.trim().length > 0 : true)
  );
  const formattedText =
    typeof text === 'string' && text.length > 0
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text;

  return (
    <Box
      is="span"
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      css={css`
        position: relative;
        display: inline-block;
      `}
      {...props}
    >
      {children}
      {hasText && isTooltipVisible && (
        <Box
          is="span"
          role="tooltip"
          aria-hidden={!isTooltipVisible}
          css={styles.tooltip}
        >
          {formattedText}
          <Box is="span" css={styles.tooltipArrow} />
        </Box>
      )}
    </Box>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  text: PropTypes.node,
  position: PropTypes.oneOf(['top', 'bottom', 'down']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Tooltip;
