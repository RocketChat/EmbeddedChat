import React from 'react';
import { Box } from '../Box';
import { GridItem } from './GridItem';
import styles from './GridStyles';

const getClassNames = (breakPoints) =>
  Object.keys(breakPoints)
    .filter((key) => !!breakPoints[key])
    .map((key) => styles[`ec-grid--${key}`])
    .concat(styles['ec-grid'])
    .join(' ');

const Grid = ({ xs, sm, md, lg, xl, ...props }) => (
  <Box className={styles['ec-grid__wrapper']}>
    <Box className={getClassNames({ xs, sm, md, lg, xl })} {...props} />
  </Box>
);

Grid.Item = GridItem;

export default Grid;
