import { css, useTheme } from '@emotion/react';
import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { ModalBackdrop } from './ModalBackdrop';

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
    const theme = useTheme();
    const ModalCss = css`
      background: none;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      position: static;
      width: 100%;
      max-width: 600px;
      padding: 0.5rem;
      background: ${theme?.palette?.background?.modal || '#fff'};
      border-radius: 0.25rem;
    `;

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
      <ModalBackdrop ref={backDropRef} onClick={handleClick}>
        <Box
          ref={ref}
          is="dialog"
          css={ModalCss}
          className={`ec-modal ${className} ${classNames}`}
          style={{ ...style, ...styleOverrides }}
          {...props}
        >
          {children}
        </Box>
      </ModalBackdrop>
    );
  }
);

Modal.displayName = Modal;
