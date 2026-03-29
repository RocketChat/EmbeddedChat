import { useState, useEffect } from 'react';

/**
 * POC: GSoC 2026 - Modern Mobile Viewport & Touch Target Management
 * Demonstrates technical depth in handling the "Dynamic Viewport Height" (dvh)
 * and responsive state management for mobile-first UI refactors.
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [vh, setVh] = useState('100vh');

  useEffect(() => {
    const handleResize = () => {
      // Logic for modern dvh (dynamic viewport height) fallback
      const currentVh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${currentVh}px`);
      setVh(`${window.innerHeight}px`);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, vh };
};

/**
 * MobileTouchTarget: Ensures all clickable nodes meet the 44x44 safe hit-area
 * requirement for WCAG 2.1 and mobile platform guidelines.
 */
export const MobileTouchTarget = ({ children, style = {} }) => (
  <div
    style={{
      minHeight: '44px',
      minWidth: '44px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);
