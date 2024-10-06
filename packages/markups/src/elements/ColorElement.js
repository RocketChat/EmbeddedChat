import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@embeddedchat/ui-elements';
import { ColorElementStyles as styles } from './elements.styles';

const ColorElement = ({ r, g, b, a }) => (
  <Box is="span">
    <Box is="span" css={styles.colorBox(r, g, b, a)} />
    rgba({r}, {g}, {b}, {(a / 255) * 100}%)
  </Box>
);

export default ColorElement;

ColorElement.propTypes = {
  r: PropTypes.number,
  g: PropTypes.number,
  b: PropTypes.number,
  a: PropTypes.number,
};
