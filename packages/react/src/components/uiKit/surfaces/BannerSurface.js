import { Margins } from '@rocket.chat/fuselage';
import React from 'react';
import { Surface } from './Surface';

const BannerSurface = ({ children }) => (
  <Surface type="banner">
    <Margins block="x8">{children}</Margins>
  </Surface>
);

export default BannerSurface;
