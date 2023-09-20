import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native'

const ColorElement = ({ r, g, b, a }) => (
  <span>
    <span
      style={{
        backgroundColor: `rgba(${r}, ${g}, ${b}, ${(a / 255) * 100}%)`,
        display: 'inline-block',
        width: '1em',
        height: '1em',
        verticalAlign: 'middle',
        marginInlineEnd: '0.5em',
      }}
    />
    <Text>{`rgba({r}, {g}, {b}, ${(a / 255) * 100}%)`}</Text>
  </span>
);

export default ColorElement;

ColorElement.propTypes = {
  r: PropTypes.number,
  g: PropTypes.number,
  b: PropTypes.number,
  a: PropTypes.number,
};
