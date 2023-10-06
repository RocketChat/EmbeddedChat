import React from 'react';
import { Box } from '../Box';
import styles from './GridStyles';

const getClassNames = (breakPoints) =>
  Object.keys(breakPoints)
    .filter((key) => !!breakPoints[key])
    .map((key) => styles[`ec-grid__item--${key}`])
    .concat(styles['ec-grid__item '])
    .join(' ');

export const GridItem = ({ xs, sm, md, lg, xl, ...props }) => (
  <Box className={`${getClassNames({ xs, sm, md, lg, xl })}`} {...props} />
);
