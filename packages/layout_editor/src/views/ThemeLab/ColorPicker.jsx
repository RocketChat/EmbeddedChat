import React from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ color, onChange }) => (
  <ChromePicker color={color} disableAlpha={true} onChange={onChange} />
);

export default ColorPicker;
