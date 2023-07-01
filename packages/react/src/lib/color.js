import Color from 'color';

export function isDark(color = '') {
  color = Color(color);

  return color.isDark();
}

export function darken(color = '', amount = 0) {
  color = Color(color);

  return color.darken(amount).hexa();
}

export function lighten(color = '', amount = 0) {
  color = Color(color);

  return color.lighten(amount).hexa();
}
