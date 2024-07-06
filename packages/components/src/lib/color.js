import Color from 'color';

export function darken(color, amount = 0) {
  color = Color(color);

  return color.darken(amount).hexa();
}

export function lighten(color, amount = 0) {
  color = Color(color);
  return color.lighten(amount).hexa();
}

export function alpha(color, amount) {
  color = Color(color);
  return color.alpha(amount).hexa();
}
