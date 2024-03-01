import { css } from '@emotion/react';

const mapTypeToPrefix = {
  neutral: 'n',
  blue: 'b',
  red: 'r',
  yellow: 'y',
  green: 'g',
  purple: 'p',
  orange: 'o',
};

const getPaletteColor = (type, grade, alpha) => {
  if (!(grade % 50 === 0 && Math.floor(grade / 50) >= 1)) {
    throw new Error('invalid color grade');
  }

  if (!(alpha === null || (alpha >= 0 && alpha <= 1))) {
    throw new Error('invalid color alpha');
  }

  const prefix = mapTypeToPrefix[type];
  if (!prefix) {
    throw new Error('invalid color type');
  }

  const baseColor = tokenColors.colors[`${prefix}${grade}`];

  if (!baseColor) {
    throw new Error(`invalid color reference: ${prefix}${grade}`);
  }

  if (alpha !== null) {
    return [
      `--rcx-color-${type}-${grade}-${alpha * 100}`,
      color.change(`${baseColor}`, { alpha }),
    ];
  }

  return [`--rcx-color-${type}-${grade}`, baseColor];
};

const neutral = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('neutral', grade, alpha);
  return `var(${variable}, ${color})`;
};

const blue = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('blue', grade, alpha);
  return `var(${variable}, ${color})`;
};

const green = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('green', grade, alpha);
  return `var(${variable}, ${color})`;
};

const yellow = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('yellow', grade, alpha);
  return `var(${variable}, ${color})`;
};

const red = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('red', grade, alpha);
  return `var(${variable}, ${color})`;
};

const orange = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('orange', grade, alpha);
  return `var(${variable}, ${color})`;
};

const purple = (grade, alpha = null) => {
  const [variable, color] = getPaletteColor('purple', grade, alpha);
  return `var(${variable}, ${color})`;
};

const surfaces = {
  light: 'white',
  tint: neutral(100),
  room: 'white',
  neutral: neutral(400),
  disabled: neutral(100),
  selected: neutral(450),
  hover: neutral(200),
  dark: neutral(900),
  featured: purple(700),
  featuredHover: purple(800),
  overlay: neutral(800),
  sidebar: neutral(400),
};

const surface = (type) => {
  const color = surfaces[type];
  return `var(--rcx-color-surface-${type}, ${color})`;
};

const fontColors = {
  white: 'white',
  disabled: neutral(500),
  annotation: neutral(600),
  hint: neutral(700),
  secondaryInfo: neutral(700),
  default: neutral(800),
  titlesLabels: neutral(900),
  info: blue(600),
  danger: red(600),
  pureBlack: neutral(800),
  pureWhite: 'white',
};

const font = (type, scape = false) => {
  const color = fontColors[type];

  if (scape) {
    return color;
  }

  return `var(--rcx-color-font-${type}, ${color})`;
};

const statusBulletColors = {
  online: green(800),
  away: yellow(800),
  busy: red(600),
  disabled: orange(500),
  offline: neutral(700),
  loading: neutral(600),
};

const statusBullet = (type) => {
  const color = statusBulletColors[type];
  return `var(--rcx-color-status-bullet-${type}, ${color})`;
};

const statusBackgroundColors = {
  success: green(200),
  warning: yellow(200),
  warning2: yellow(100),
  danger: red(200),
  service1: orange(200),
  service2: purple(200),
  info: blue(200),
};

const statusBackground = (type) => {
  const color = statusBackgroundColors[type];
  return `var(--rcx-color-status-background-${type}, ${color})`;
};

const statusFontColors = {
  onSuccess: green(800),
  onWarning: yellow(800),
  onWarning2: neutral(800),
  onDanger: red(800),
  onService1: orange(800),
  onService2: purple(600),
  onInfo: blue(600),
};

const statusFont = (type) => {
  const color = statusFontColors[type];
  return `var(--rcx-color-status-font-${type}, ${color})`;
};

const strokeColors = {
  extraLight: neutral(250),
  light: neutral(500),
  medium: neutral(600),
  dark: neutral(700),
  extraDark: neutral(800),
  extraLightHighlight: blue(200),
  highlight: blue(500),
  extraLightError: red(200),
  error: red(500),
};

const stroke = (type) => {
  const color = strokeColors[type];
  return `var(--rcx-color-stroke-${type}, ${color})`;
};

const badgeBackgroundColors = {
  level0: neutral(400),
  level1: neutral(600),
  level2: blue(500),
  level3: orange(500),
  level4: red(500),
};

const badge = (type) => {
  const color = badgeBackgroundColors[type];
  return `var(--rcx-color-badge-background-${type}, ${color})`;
};

const shadowColors = {
  highlight: blue(200),
  extraLightError: red(200),
  danger: red(100),
  elevation1: neutral(800, 0.1),
  elevation2x: neutral(800, 0.08),
  elevation2y: neutral(800, 0.12),
  elevationBorder: stroke('extraLight'),
};

const shadow = (type) => {
  const color = shadowColors[type];
  return `var(--rcx-color-shadow-${type}, ${color})`;
};

const buttonBackgroundColors = {
  primaryDefault: blue(500),
  primaryHover: blue(600),
  primaryPress: blue(700),
  primaryFocus: blue(500),
  primaryKeyFocus: blue(500),
  primaryDisabled: blue(200),
  secondaryDefault: neutral(400),
  secondaryHover: neutral(500),
  secondaryPress: neutral(600),
  secondaryFocus: neutral(400),
  secondaryKeyFocus: neutral(400),
  secondaryDisabled: neutral(300),
  dangerDefault: red(500),
  dangerHover: red(600),
  dangerPress: red(700),
  dangerFocus: red(500),
  dangerKeyFocus: red(500),
  dangerDisabled: red(200),
  secondaryDangerDefault: neutral(400),
  secondaryDangerHover: neutral(500),
  secondaryDangerPress: neutral(600),
  secondaryDangerFocus: neutral(400),
  secondaryDangerKeyFocus: neutral(400),
  secondaryDangerDisabled: neutral(300),
  warningDefault: yellow(400),
  warningHover: yellow(500),
  warningPress: yellow(600),
  warningFocus: yellow(400),
  warningKeyFocus: yellow(400),
  warningDisabled: yellow(200),
  secondaryWarningDefault: neutral(400),
  secondaryWarningHover: neutral(500),
  secondaryWarningPress: neutral(600),
  secondaryWarningFocus: neutral(400),
  secondaryWarningKeyFocus: neutral(400),
  secondaryWarningDisabled: neutral(300),
  successDefault: green(800),
  successHover: green(900),
  successPress: green(1000),
  successFocus: green(800),
  successKeyFocus: green(800),
  successDisabled: green(200),
  secondarySuccessDefault: neutral(400),
  secondarySuccessHover: neutral(500),
  secondarySuccessPress: neutral(600),
  secondarySuccessFocus: neutral(400),
  secondarySuccessKeyFocus: neutral(400),
  secondarySuccessDisabled: neutral(300),
};

const buttonFontColors = {
  onPrimary: 'white',
  onPrimaryDisabled: 'white',
  onSecondary: neutral(900),
  onSecondaryDisabled: neutral(500),
  onDanger: 'white',
  onDangerDisabled: 'white',
  onSecondaryDanger: red(700),
  onSecondaryDangerDisabled: red(300),
  onWarning: neutral(900),
  onWarningDisabled: neutral(600),
  onSecondaryWarning: yellow(900),
  onSecondaryWarningDisabled: yellow(600),
  onSuccess: 'white',
  onSuccessDisabled: 'white',
  onSecondarySuccess: green(800),
  onSecondarySuccessDisabled: green(400),
  onDisabled: neutral(600),
};

const button = (type) => {
  const background = buttonBackgroundColors[type];
  const foreground = buttonFontColors[type];

  if (background) {
    return `var(--rcx-color-button-background-${type}, ${background})`;
  }

  if (foreground) {
    return `var(--rcx-color-button-font-${type}, ${foreground})`;
  }

  throw new Error(`Unknown button type ${type}.`);
};

const neutralAlphaLevel = {
  8: neutral(800, 0.08),
  10: neutral(800, 0.1),
  12: neutral(800, 0.12),
  50: neutral(800, 0.5),
};

const surfaceNeutralAlpha = (level) => {
  return map.get(neutralAlphaLevel, `${level}`);
};

const elevationLevel = {
  border: stroke('extraLight'),
  1: surfaceNeutralAlpha(10),
  '2x': surfaceNeutralAlpha(8),
  '2y': surfaceNeutralAlpha(12),
};

const elevation = (level) => {
  return map.get(elevationLevel, `${level}`);
};

export {
  css,
  neutral,
  blue,
  green,
  yellow,
  red,
  orange,
  purple,
  surface,
  font,
  statusBullet,
  statusBackground,
  statusFont,
  stroke,
  badge,
  shadow,
  button,
  surfaceNeutralAlpha,
  elevation,
};
