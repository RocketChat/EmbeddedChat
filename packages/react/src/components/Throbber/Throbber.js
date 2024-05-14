import { useTheme } from '@emotion/react';
import React, { forwardRef } from 'react';
import styles from './Throbber.styles';

import { Box } from '../Box';

function Circle({
  disabled,
  circleCount,
  iteration,
  inheritColor,
  size,
  ...props
}) {
  const theme = useTheme();

  return (
    <Box
      css={styles.circle(theme, size, circleCount, iteration)}
      className={`${disabled ? 'disabled' : ''} ${
        inheritColor ? 'inherit-color' : ''
      }`}
      {...props}
    />
  );
}

const Throbber = forwardRef(
  (
    { disabled, size = '16px', circleCount = 3, inheritColor, ...props },
    ref
  ) => (
    <Box css={styles.throbber} ref={ref} {...props}>
      {Array.from({ length: circleCount || 3 }, (_, iteration) => (
        <Circle
          key={iteration}
          circleCount={circleCount}
          iteration={iteration}
          disabled={!!disabled}
          size={size}
          inheritColor={!!inheritColor}
        />
      ))}
    </Box>
  )
);
Throbber.displayName = 'Throbber';

export default Throbber;
