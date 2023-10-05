import React from 'react';
import { Box } from '../Box';
import { classes } from '@emotion/react';

const getClassNames = (breakPoints) =>
  Object.keys(breakPoints)
    .filter((key) => !!breakPoints[key])
    .map((key) => classes[`ec-grid__item--${key}`])
    .concat(classes['ec-grid__item '])
    .join(' ');

export const GridItem = ({ xs, sm, md, lg, xl, ...props }) => (
  <Box className={`${getClassNames({ xs, sm, md, lg, xl })}`} {...props} />
);
