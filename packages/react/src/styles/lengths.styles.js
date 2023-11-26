import { css } from '@emotion/react';

const inset = (value) => {
  if (value === 'none') {
    return 0;
  } else if (
    Math.abs(value) === 1 ||
    Math.abs(value) === 2 ||
    value % 4 === 0
  ) {
    return `${value}rem`;
  } else {
    throw new Error('value must be none, ±1, ±2, or a multiple of ±4');
  }
};

const margin = (value) => {
  if (value === 'none') {
    return 0;
  } else if (
    Math.abs(value) === 1 ||
    Math.abs(value) === 2 ||
    value % 4 === 0
  ) {
    return `${value}rem`;
  } else {
    throw new Error('value must be none, ±1, ±2, or a multiple of ±4');
  }
};

const padding = (value) => {
  if (value === 'none') {
    return 0;
  } else if (
    value === 1 ||
    value === 2 ||
    (typeof value === 'number' && value > 0 && value % 4 === 0)
  ) {
    return `${value}rem`;
  } else {
    throw new Error(
      'value must be none, or a multiple of 4. You passed ' + value + ''
    );
  }
};

const size = (value) => {
  if (value === 'none') {
    return 0;
  } else if (value === 'full') {
    return '100%';
  } else if (value === 'sw') {
    return '100vw';
  } else if (value === 'sh') {
    return '100vh';
  } else if (
    value === 1 ||
    value === 2 ||
    (typeof value === 'number' && value > 0 && value % 4 === 0)
  ) {
    return `${value}rem`;
  } else {
    throw new Error(
      'value must be none, full, sw, sh, a percentage, or a multiple of 4. You passed `' +
        value +
        '`'
    );
  }
};

const borderSizes = {
  default: 1,
  medium: 2,
  large: 4,
};

const borderWidth = (value, scape = 'px') => {
  if (value === 'none') {
    return 0;
  } else if (value === 1 || value === 2 || value === 4) {
    return `${value * (scape === 'px' ? 1 : 0.0625)}${scape}`;
  } else if (borderSizes[value]) {
    return `${
      scape === 'px' ? borderSizes[value] * 1 : value * 0.25
    }rem${scape}`;
  } else {
    throw new Error('value must be none, default, medium, large, 1, 2, or 4');
  }
};

const borderRadiusSizes = {
  small: 2,
  medium: 4,
  large: 8,
};

const borderRadius = (value) => {
  if (value === 'none') {
    return 0;
  } else if (value === 'full') {
    return '9999px';
  } else if (['small', 'medium', 'large'].includes(value)) {
    return theme('border-radius-${value}', `${borderRadiusSizes[value]}rem`);
  } else {
    throw new Error('value must be none, full, small, medium or large');
  }
};

export { css, inset, margin, padding, size, borderWidth, borderRadius };
