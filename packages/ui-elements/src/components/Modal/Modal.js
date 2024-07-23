import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { ModalBackdrop } from './ModalBackdrop';
import { useModalstyles } from './Modal.styles';
import ReactPortal from '../../lib/reactPortal';

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
    const styles = useModalstyles();

    const handleClick = useCallback(
      (e) => {
        if (e.target === backDropRef.current) {
          onClose();
        }
      },
      [onClose]
    );

    const handleEscKey = useCallback(
      (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      window.addEventListener('keydown', handleEscKey);

      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    }, [handleEscKey]);

    if (!open) {
      return null;
    }

    return (
      <ReactPortal wrapperId="overlay-items">
        <ModalBackdrop ref={backDropRef} onClick={handleClick}>
          <Box
            ref={ref}
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

Modal.displayName = Modal;
