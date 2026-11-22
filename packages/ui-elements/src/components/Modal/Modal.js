import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { ModalBackdrop } from './ModalBackdrop';
import { getModalstyles } from './Modal.styles';
import ReactPortal from '../../lib/reactPortal';
import { useTheme } from '../../hooks';

export const Modal = forwardRef(
  (
    {
      className = '',
      style = {},
      open = true,
      children,
      onClose = () => {},
      ...props
    },
    ref
  ) => {
    const { classNames, styleOverrides } = useComponentOverrides('Modal');
    const backDropRef = useRef(null);
    const dialogRef = useRef(null);
    const { theme } = useTheme();
    const styles = getModalstyles(theme);

    const setModalRef = (node) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleClick = useCallback(
      (e) => {
        if (e.target === backDropRef.current) {
          onClose();
        }
      },
      [onClose]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (
              document.activeElement === firstElement ||
              !dialogRef.current.contains(document.activeElement)
            ) {
              e.preventDefault();
              lastElement.focus();
            }
          } else if (
            document.activeElement === lastElement ||
            !dialogRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (!open) return undefined;
      const previousActiveElement = document.activeElement;

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (
          previousActiveElement &&
          typeof previousActiveElement.focus === 'function'
        ) {
          previousActiveElement.focus();
        }
      };
    }, [open, handleKeyDown]);

    if (!open) {
      return null;
    }

    return (
      <ReactPortal wrapperId="overlay-items">
        <ModalBackdrop ref={backDropRef} onClick={handleClick}>
          <Box
            ref={setModalRef}
            is="dialog"
            css={styles.main}
            className={`ec-modal ${className} ${classNames}`}
            style={{ ...style, ...styleOverrides }}
            {...props}
          >
            {children}
          </Box>
        </ModalBackdrop>
      </ReactPortal>
    );
  }
);

Modal.displayName = 'Modal';
