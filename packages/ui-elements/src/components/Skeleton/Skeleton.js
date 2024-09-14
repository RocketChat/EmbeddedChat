import React from 'react';
import { Box } from '../Box';
import getSkeletonStyles from './Skeleton.styles';
import { useTheme } from '../../hooks';

const Skeleton = ({ variant = 'text', height, width, ...props }) => {
  const { theme } = useTheme();
  const styles = getSkeletonStyles(theme);
  return (
    <Box
      css={styles.skeleton}
      style={{ display: 'inlineBlock', height, width }}
      className={`ec-skeleton ${variant}`}
      {...props}
    />
  );
};
export default Skeleton;
