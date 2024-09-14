import React, { useContext, useMemo, useCallback } from 'react';
import useTheme from '../../hooks/useTheme';
import ToastContext from '../../context/ToastContext';
import { Box } from '../Box';
import ToastBar from './ToastBar';
import { getToastBarContainerStyles } from './ToastBar.styles';

const ToastContainer = () => {
  const { theme } = useTheme();
  const styles = getToastBarContainerStyles(theme);
  const { position, toasts, setToasts } = useContext(ToastContext);
  const positionStyle = useMemo(() => {
    const positions = position.split(/\s+/);
    const styleAnchor = {};
    positions.forEach((pos) => {
      styleAnchor[pos] = `2rem`;
    });
    return styleAnchor;
  }, [position]);
  const currentToast = useMemo(() => {
    const toast = toasts[toasts.length - 1];
    return toast;
  }, [toasts]);

  const onClose = useCallback(() => {
    setToasts(toasts.slice(0, toasts.length - 1));
  }, [setToasts, toasts]);
  if (!currentToast) {
    return null;
  }

  return (
    <Box css={styles.container} style={positionStyle}>
      <ToastBar toast={currentToast} onClose={onClose} />
    </Box>
  );
};

export default ToastContainer;
