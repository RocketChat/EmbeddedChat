import React, { useState } from 'react';

const Tooltip = ({ children, text, position }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    let tooltipPosition = -100;

    if (position === "top") {
        tooltipPosition = -100;
    } else {
        tooltipPosition = 101;
    }

    const handleMouseEnter = () => {
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const handleTouchStart = () => {
        touchTimer = setTimeout(() => {
            setTooltipVisible(true);
        }, 500); 
    };

    const handleTouchEnd = () => {
       
        clearTimeout(touchTimer);
        setTooltipVisible(false);
    };

    let touchTimer;

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
                <div
                    style={{
                        position: 'absolute',
                        top: `${tooltipPosition}%`,
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
                        fontFamily: 'sans-serif'
                    }}
                >
                    {text.charAt(0).toUpperCase() + text.slice(1)}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
