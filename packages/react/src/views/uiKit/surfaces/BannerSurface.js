import React from 'react';
import { Surface } from './Surface';
import { Box } from '../../../components/Box';

const BannerSurface = ({ children }) => (
  <Surface type="banner">
    <Box style={{ marginBlock: '0.5rem' }}>{children}</Box>
  </Surface>
);

export default BannerSurface;
