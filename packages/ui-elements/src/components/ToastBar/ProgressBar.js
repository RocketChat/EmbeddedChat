import React, { useEffect, useState } from 'react';
import { Box } from '../Box';
import useTheme from '../../hooks/useTheme';
import { getProgressBarStyles } from './ToastBar.styles';

const ProgressBar = ({ color, time }) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = getProgressBarStyles(theme, mode, progress, color);

  useEffect(() => {
    const intervalTime = 10;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <Box css={styles.progressBarContainer}>
      <Box css={styles.progressbar} />
    </Box>
  );
};

export default ProgressBar;
