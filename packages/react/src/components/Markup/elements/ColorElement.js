import PropTypes from 'prop-types';
import React from 'react';

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
    rgba({r}, {g}, {b}, {(a / 255) * 100}%)
  </span>
);

export default ColorElement;

ColorElement.propTypes = {
  r: PropTypes.number,
  g: PropTypes.number,
  b: PropTypes.number,
  a: PropTypes.number,
};
