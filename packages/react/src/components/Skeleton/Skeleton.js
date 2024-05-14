import React from 'react';
import { Box } from '../Box';
import styles from './Skeleton.styles';

const Skeleton = ({ variant = 'text', height, width, ...props }) => (
  <Box
    css={styles.skeleton}
    style={{ display: 'inlineBlock', height, width }}
    className={`ec-skeleton ${variant}`}
    {...props}
  />
);
export default Skeleton;
