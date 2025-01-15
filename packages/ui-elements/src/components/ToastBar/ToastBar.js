/* eslint-disable no-shadow */
import React, { useMemo, useRef, useEffect } from 'react';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { getToastbarStyles } from './ToastBar.styles';
import useTheme from '../../hooks/useTheme';
import ProgressBar from './ProgressBar';
import { darken, lighten } from '../../lib';

const ToastBar = ({ toast, onClose }) => {
  const { type, message, time = 2000 } = toast;
  const toastRef = useRef();
  const { theme } = useTheme();
  const { mode } = useTheme();

  const { classNames, styleOverrides } = useComponentOverrides('ToastBar');
  const styles = getToastbarStyles(theme);
  const { iconName, bgColor, color } = useMemo(() => {
    const color =
      type === 'error'
        ? theme.colors.destructiveForeground
        : theme.colors[`${type}Foreground`];
    const bgColor =
      type === 'error' ? theme.colors.destructive : theme.colors[type];

    let iconName = 'success';
    switch (type) {
      case 'info':
        iconName = 'info';
        break;
      case 'warning':
        iconName = 'report';
        break;
      case 'error':
        iconName = 'error-circle';
        break;
      case 'success':
      default:
        iconName = 'check';
    }
    return { iconName, color, bgColor };
  }, [theme.colors, type]);

  useEffect(() => {
    setTimeout(onClose, time);
  }, [onClose, time]);

  let progressBarBgColor = darken(bgColor, 0.5);
  if (mode === 'dark') {
    progressBarBgColor = lighten(bgColor, 0.85);
  }

  return (
    <>
      <Box
        ref={toastRef}
        css={styles.toastbar(color, bgColor, time)}
        className={appendClassNames('ec-toast-bar', classNames)}
        style={styleOverrides}
      >
        <Icon size="1em" name={iconName} />
        {message}
        <ActionButton icon="cross" size="small" onClick={onClose} ghost />
      </Box>
      <Box>
        <ProgressBar color={progressBarBgColor} time={time} />
      </Box>
    </>
  );
};

export default ToastBar;
