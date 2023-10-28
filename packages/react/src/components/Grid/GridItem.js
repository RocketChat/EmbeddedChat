import React from 'react';
import { Box } from '../Box';
import styles from './GridStyles';

const getClassNames = (breakPoints) =>
  Object.keys(breakPoints)
    .filter((key) => !!breakPoints[key])
    .map((key) => `${styles.ecGridItem}--${key}`)
    .concat(styles.ecGridItem)
    .join(' ');

export const GridItem = ({ xs, sm, md, lg, xl, ...props }) => (
  <Box className={`${getClassNames({ xs, sm, md, lg, xl })}`} {...props} />
);
