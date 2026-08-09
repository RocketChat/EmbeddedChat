import { useEffect } from 'react';

const useLockBodyScroll = (locked) => {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return undefined;

    const bodyStyle = document.body.style;
    const previousOverflow = bodyStyle.overflow;
    const previousPaddingRight = bodyStyle.paddingRight;
    const scrollbarWidth =
      typeof window === 'undefined'
        ? 0
        : window.innerWidth - document.documentElement.clientWidth;

    bodyStyle.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      bodyStyle.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      bodyStyle.overflow = previousOverflow;
      bodyStyle.paddingRight = previousPaddingRight;
    };
  }, [locked]);
};

export default useLockBodyScroll;
