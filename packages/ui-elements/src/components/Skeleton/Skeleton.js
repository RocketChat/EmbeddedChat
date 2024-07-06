import React from 'react';
import { Box } from '../Box';
import useSkeletonStyles from './Skeleton.styles';

const Skeleton = ({ variant = 'text', height, width, ...props }) => {
  const styles = useSkeletonStyles();
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
