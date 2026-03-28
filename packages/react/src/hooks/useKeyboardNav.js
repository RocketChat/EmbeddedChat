import { useCallback } from 'react';

/**
 * Returns an onKeyDown handler that enables arrow-key navigation
 * between focusable siblings inside a toolbar or menu container.
 *
 * @param {object} options
 * @param {string}   options.selector   - CSS selector for focusable items (default: '[role="button"],button,a')
 * @param {'horizontal'|'vertical'|'both'} options.direction - navigation axis (default: 'horizontal')
 * @param {Function} options.onEscape   - called when Escape is pressed
 * @returns {Function} onKeyDown handler
 */
const useKeyboardNav = ({
  selector = '[role="button"],button,a,[tabindex="0"]',
  direction = 'horizontal',
  onEscape,
} = {}) => {
  const handleKeyDown = useCallback(
    (e) => {
      const container = e.currentTarget;
      const items = Array.from(container.querySelectorAll(selector)).filter(
        (el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true'
      );

      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);

      const goNext =
        (direction === 'horizontal' && e.key === 'ArrowRight') ||
        (direction === 'vertical' && e.key === 'ArrowDown') ||
        direction === 'both' && (e.key === 'ArrowRight' || e.key === 'ArrowDown');

      const goPrev =
        (direction === 'horizontal' && e.key === 'ArrowLeft') ||
        (direction === 'vertical' && e.key === 'ArrowUp') ||
        direction === 'both' && (e.key === 'ArrowLeft' || e.key === 'ArrowUp');

      if (goNext) {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (goPrev) {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      } else if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    },
    [selector, direction, onEscape]
  );

  return handleKeyDown;
};

export default useKeyboardNav;
