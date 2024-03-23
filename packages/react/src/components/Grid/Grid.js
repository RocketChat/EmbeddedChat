import React from 'react';
import { Box } from '../Box';
import { GridItem } from './GridItem';
import classes from './Grid.module.css';

const getClassNames = (breakPoints) =>
  Object.keys(breakPoints)
    .filter((key) => !!breakPoints[key])
    .map((key) => classes[`ec-grid--${key}`])
    .concat(classes['ec-grid'])
    .join(' ');

const Grid = ({ xs, sm, md, lg, xl, ...props }) => (
  <Box className={classes['ec-grid__wrapper']}>
    <Box className={getClassNames({ xs, sm, md, lg, xl })} {...props} />
  </Box>
);

Grid.Item = GridItem;

export default Grid;
