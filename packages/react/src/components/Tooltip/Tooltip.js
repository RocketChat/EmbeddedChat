import React, { useState } from 'react';

const Tooltip = ({ children, text, position, X, Y }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  let touchTimer;
  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    padding: '4.5px',
    borderRadius: '3px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
    zIndex: 999,
    fontSize: '13.8px',
    whiteSpace: 'nowrap',
    fontFamily: 'sans-serif',
    left: '64%',
    transform: 'translateX(-50%) ',
  };

  const tooltipArrowStyle = {
    content: '""',
    position: 'absolute',
    left: '50%',
    marginLeft: '-5px',
    borderWidth: '6px',
    borderStyle: 'solid',
    borderColor: 'black transparent transparent transparent',
    zIndex: 999,
  };

  // Add more positions according to your needs and modify tooltipStyle and tooltipArrowStyle accordingly
  if (position === 'top') {
    tooltipStyle.top = '-2.3rem';
    tooltipArrowStyle.top = '100%';
  } else if (position === 'bottom') {
    tooltipStyle.top = '100%';
    tooltipStyle.transform = 'translateY(45%) translateX(-55%)';
    tooltipArrowStyle.bottom = '100%';
    tooltipArrowStyle.transform = 'rotate(180deg)';
  }

  const handleMouseEnter = () => {
    touchTimer = setTimeout(() => {
      setTooltipVisible(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(touchTimer);
    setTooltipVisible(false);
  };

  const handleTouchStart = () => {
    touchTimer = setTimeout(() => {
      setTooltipVisible(true);
    }, 400);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer);
    setTooltipVisible(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {isTooltipVisible && (
        <div style={tooltipStyle}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
          <div style={tooltipArrowStyle} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
