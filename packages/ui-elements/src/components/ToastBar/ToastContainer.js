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

  const stackedToasts = useMemo(() => [...toasts].reverse(), [toasts]);

  const handleClose = useCallback(
    (id) => {
      setToasts((prevItems) => prevItems.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  if (!stackedToasts.length) {
    return null;
  }

  return (
    <Box css={styles.container} style={positionStyle}>
      {stackedToasts.map((toast) => (
        <ToastBar
          key={toast.id}
          toast={toast}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </Box>
  );
};

export default ToastContainer;
