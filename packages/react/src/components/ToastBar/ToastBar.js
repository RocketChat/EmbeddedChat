/* eslint-disable no-shadow */
import React, { useMemo, useRef, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import alpha from 'color-alpha';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { toastbarStyles as styles } from './ToastBar.styles';

const ToastBar = ({ toast, onClose }) => {
  const { type, message, time = 2000 } = toast;
  const toastRef = useRef();
  const theme = useTheme();
  const { classNames, styleOverrides } = useComponentOverrides('ToastBar');
  const { iconName, bgColor, color } = useMemo(() => {
    const color = theme.palette?.[type]?.main;
    const bgColor = alpha(color, 0.3);
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
  }, [theme.palette, type]);

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
