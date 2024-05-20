/* eslint-disable no-shadow */
import React, { useMemo, useRef, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { toastbarStyles as styles } from './ToastBar.styles';
import { useThemeStore } from '../../store';

const ToastBar = ({ toast, onClose }) => {
  const { type, message, time = 2000 } = toast;
  const toastRef = useRef();
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const { classNames, styleOverrides } = useComponentOverrides('ToastBar');
  const { iconName, bgColor, color } = useMemo(() => {
    const color =
      type === 'error'
        ? colors.destructiveForeground
        : colors[`${type}Foreground`];
    const bgColor = type === 'error' ? colors.destructive : colors[type];

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
  }, [colors, type]);

  useEffect(() => {
    setTimeout(onClose, time);
  }, [onClose, time]);

  return (
    <Box
      ref={toastRef}
      css={styles.toastbar(theme, color, bgColor, time)}
      className={appendClassNames('ec-toast-bar', classNames)}
      style={styleOverrides}
    >
      <Icon size="1em" name={iconName} />
      {message}
      <ActionButton icon="cross" size="small" onClick={onClose} ghost />
    </Box>
  );
};

export default ToastBar;
