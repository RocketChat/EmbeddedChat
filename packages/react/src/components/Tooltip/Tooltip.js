import React, { useState } from 'react';

const Tooltip = ({ children, text, position }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const tooltipStyle = {
    position: 'absolute',
    left: '64%',
    transform: 'translateX(-50%) ',
    backgroundColor: 'rgba(97, 97, 97, 1)',
    color: 'white',
    padding: '4px',
    borderRadius: '3px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
    fontSize: '12.5px',
    whiteSpace: 'nowrap',
    fontFamily: 'sans-serif',
  };

  const tooltipArrowStyle = {
    content: '""',
    position: 'absolute',
    left: '50%',
    marginLeft: '-5px',
    borderWidth: '6px',
    borderStyle: 'solid',
    borderColor: 'rgba(97, 97, 97, 1) transparent transparent transparent',
  };

  // Add more positions according to your needs and modify tooltipStyle and tooltipArrowStyle accordingly

  if (position === 'top') {
    tooltipStyle.top = 'calc(-100% - 10px)'; // avoid overlaying the element
    tooltipArrowStyle.top = '100%';
    tooltipArrowStyle.transform = 'translateX(-50%)';
  } else if (position === 'bottom') {
    tooltipStyle.top = '100%';
    tooltipArrowStyle.bottom = '100%';
    tooltipArrowStyle.transform = 'translateX(-50%) rotate(180deg)';
  }

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
