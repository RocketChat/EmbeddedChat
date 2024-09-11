import React, { forwardRef } from 'react';
import getThrobberStyles from './Throbber.styles';
import { Box } from '../Box';
import { useTheme } from '../../hooks';

function Circle({
  disabled,
  circleCount,
  iteration,
  inheritColor,
  size,
  ...props
}) {
  const { theme } = useTheme();
  const styles = getThrobberStyles(theme);
  return (
    <Box
      css={styles.circle(size, circleCount, iteration)}
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
  ) => {
    const { theme } = useTheme();
    const styles = getThrobberStyles(theme);
    return (
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
    );
  }
);
Throbber.displayName = 'Throbber';

export default Throbber;
