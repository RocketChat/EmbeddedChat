const MINIMUM_TEXT_CONTRAST = 4.5;

export const FONT_STACKS = {
  sans: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Courier New", Courier, monospace',
};

export const THEME_RADII = ['0rem', '0.25rem', '0.5rem', '1.5rem'];

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

const hsl = (hue, saturation, lightness) =>
  `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(
    lightness
  )}%)`;

export const normalizeHex = (value) => {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^#?([a-f\d]{3}|[a-f\d]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3
    ? match[1].split('').map((character) => character + character).join('')
    : match[1];
  return `#${hex.toLowerCase()}`;
};

export const hexToHsl = (value) => {
  const hex = normalizeHex(value);
  if (!hex) return null;

  const channels = [1, 3, 5].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
  );
  const [red, green, blue] = channels;
  const maximum = Math.max(...channels);
  const minimum = Math.min(...channels);
  const delta = maximum - minimum;
  const lightness = (maximum + minimum) / 2;

  let hue = 0;
  if (delta) {
    if (maximum === red) hue = ((green - blue) / delta) % 6;
    if (maximum === green) hue = (blue - red) / delta + 2;
    if (maximum === blue) hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  const saturation = delta
    ? delta / (1 - Math.abs(2 * lightness - 1))
    : 0;
  return { hue, saturation: saturation * 100, lightness: lightness * 100 };
};

const hslToRgb = ({ hue, saturation, lightness }) => {
  const normalizedSaturation = saturation / 100;
  const normalizedLightness = lightness / 100;
  const chroma =
    (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = normalizedLightness - chroma / 2;
  let channels = [0, 0, 0];

  if (hue < 60) channels = [chroma, second, 0];
  else if (hue < 120) channels = [second, chroma, 0];
  else if (hue < 180) channels = [0, chroma, second];
  else if (hue < 240) channels = [0, second, chroma];
  else if (hue < 300) channels = [second, 0, chroma];
  else channels = [chroma, 0, second];

  return channels.map((channel) => channel + match);
};

const parseHsl = (value) => {
  const match = typeof value === 'string'
    ? value.match(/^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i)
    : null;
  if (!match) return null;
  return {
    hue: Number(match[1]) % 360,
    saturation: Number(match[2]),
    lightness: Number(match[3]),
  };
};

const toRgb = (value) => {
  const hslValue = parseHsl(value);
  if (hslValue) return hslToRgb(hslValue);
  const hex = normalizeHex(value);
  if (!hex) return null;
  return [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
  );
};

export const colorToHex = (value) => {
  const rgb = toRgb(value);
  if (!rgb) return null;
  return `#${rgb
    .map((channel) =>
      Math.round(clamp(channel, 0, 1) * 255).toString(16).padStart(2, '0')
    )
    .join('')}`;
};

const relativeLuminance = (value) => {
  const rgb = toRgb(value);
  if (!rgb) return 0;
  const [red, green, blue] = rgb.map((channel) =>
    channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const contrastRatio = (first, second) => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

const contrastingText = (background) => {
  const white = 'hsl(0, 0%, 100%)';
  // True black is necessary here: a softened dark gray can leave highly
  // saturated mid-tone colors below the 4.5:1 AA threshold against both
  // foreground options.
  const black = 'hsl(0, 0%, 0%)';
  return contrastRatio(background, white) >= contrastRatio(background, black)
    ? white
    : black;
};

const TOKEN_FOREGROUNDS = {
  background: 'foreground',
  card: 'cardForeground',
  popover: 'popoverForeground',
  primary: 'primaryForeground',
  secondary: 'secondaryForeground',
  muted: 'mutedForeground',
  accent: 'accentForeground',
  destructive: 'destructiveForeground',
  warning: 'warningForeground',
  success: 'successForeground',
  info: 'infoForeground',
};

const foregroundColor = (color, background, direction) => {
  let lightness = color.lightness;
  for (let step = 0; step <= 100; step += 1) {
    const candidate = hsl(color.hue, color.saturation, lightness);
    if (contrastRatio(candidate, background) >= MINIMUM_TEXT_CONTRAST) {
      return candidate;
    }
    lightness = clamp(lightness + direction, 0, 100);
  }
  return hsl(color.hue, color.saturation, lightness);
};

const semanticScheme = (seed, accent, mode) => {
  const primarySaturation = clamp(Math.max(seed.saturation, 70), 70, 92);
  const accentSaturation = clamp(Math.max(accent.saturation, 62), 62, 88);
  const isLight = mode === 'light';
  const background = hsl(seed.hue, Math.min(seed.saturation, 14), isLight ? 99 : 8);
  const foreground = hsl(seed.hue, Math.min(seed.saturation, 18), isLight ? 10 : 94);
  const card = hsl(seed.hue, Math.min(seed.saturation, 12), isLight ? 100 : 12);
  const primary = foregroundColor(
    {
      hue: seed.hue,
      saturation: primarySaturation,
      lightness: isLight ? 42 : 66,
    },
    background,
    isLight ? -1 : 1
  );
  const secondary = hsl(seed.hue, Math.min(seed.saturation, 30), isLight ? 92 : 21);
  const accentColor = hsl(accent.hue, accentSaturation, isLight ? 44 : 67);
  const muted = hsl(seed.hue, Math.min(seed.saturation, 14), isLight ? 95 : 17);
  const destructive = hsl(0, isLight ? 72 : 68, isLight ? 43 : 64);
  const warning = hsl(38, 92, isLight ? 40 : 66);
  const success = hsl(142, 62, isLight ? 32 : 58);
  const info = hsl(214, 78, isLight ? 42 : 67);

  return {
    background,
    foreground,
    card,
    cardForeground: contrastingText(card),
    popover: card,
    popoverForeground: contrastingText(card),
    primary,
    primaryForeground: contrastingText(primary),
    secondary,
    secondaryForeground: contrastingText(secondary),
    muted,
    mutedForeground: isLight
      ? hsl(seed.hue, Math.min(seed.saturation, 18), 34)
      : hsl(seed.hue, Math.min(seed.saturation, 18), 68),
    accent: accentColor,
    accentForeground: contrastingText(accentColor),
    destructive,
    destructiveForeground: contrastingText(destructive),
    border: hsl(seed.hue, Math.min(seed.saturation, 18), isLight ? 84 : 27),
    input: hsl(seed.hue, Math.min(seed.saturation, 18), isLight ? 84 : 27),
    ring: primary,
    warning,
    warningForeground: contrastingText(warning),
    success,
    successForeground: contrastingText(success),
    info,
    infoForeground: contrastingText(info),
  };
};

export const getAccessibilityReport = (theme) => {
  const pairs = [
    ['Background text', 'background', 'foreground'],
    ['Card text', 'card', 'cardForeground'],
    ['Primary action', 'primary', 'primaryForeground'],
    ['Secondary action', 'secondary', 'secondaryForeground'],
    ['Accent action', 'accent', 'accentForeground'],
    ['Destructive action', 'destructive', 'destructiveForeground'],
    ['Username link', 'background', 'primary'],
    ['Message metadata', 'background', 'mutedForeground'],
  ];

  return ['light', 'dark'].flatMap((mode) =>
    pairs.map(([label, background, foreground]) => {
      const ratio = contrastRatio(
        theme.schemes[mode][background],
        theme.schemes[mode][foreground]
      );
      return {
        label: `${mode === 'light' ? 'Light' : 'Dark'} ${label}`,
        ratio: Number(ratio.toFixed(2)),
        passes: ratio >= MINIMUM_TEXT_CONTRAST,
      };
    })
  );
};

export const isValidTheme = (theme) => {
  if (!theme?.schemes?.light || !theme?.schemes?.dark) return false;
  return getAccessibilityReport(theme).every((result) => result.passes);
};

/**
 * Updates one semantic token in one color mode. Background/action tokens
 * repair their paired text token automatically, so manual palette editing
 * keeps the generated theme accessible rather than bypassing validation.
 */
export const applyThemePaletteChange = (baseTheme, { mode, token, value }) => {
  const color = normalizeHex(value);
  if (!color || !['light', 'dark'].includes(mode) || !baseTheme?.schemes?.[mode]) {
    return null;
  }

  const scheme = baseTheme.schemes[mode];
  if (!(token in scheme)) return null;
  const nextScheme = { ...scheme, [token]: color };
  const pairedForeground = TOKEN_FOREGROUNDS[token];

  if (pairedForeground) {
    nextScheme[pairedForeground] = contrastingText(color);
  }

  if (token === 'primary') {
    const primary = foregroundColor(
      hexToHsl(color),
      nextScheme.background,
      mode === 'light' ? -1 : 1
    );
    nextScheme.primary = primary;
    nextScheme.primaryForeground = contrastingText(primary);
    nextScheme.ring = primary;
  }

  return {
    ...baseTheme,
    schemes: { ...baseTheme.schemes, [mode]: nextScheme },
  };
};

/**
 * Applies an intentional refinement without regenerating the entire palette.
 * This is deliberately separate from initial theme generation: a request such
 * as "make the corners rounder" must never alter the existing color tokens.
 */
export const applyThemeRefinement = (baseTheme, options = {}) => {
  if (!baseTheme) return null;
  const primary = normalizeHex(options.primaryHex);
  const accent = normalizeHex(options.accentHex);
  const radius = THEME_RADII.includes(options.radius)
    ? options.radius
    : baseTheme.radius;
  const fontFamily = Object.values(FONT_STACKS).includes(options.fontFamily)
    ? options.fontFamily
    : baseTheme.typography?.default?.fontFamily;

  const refineScheme = (scheme, mode) => {
    const nextScheme = { ...scheme };
    if (primary) {
      const primaryColor = foregroundColor(
        hexToHsl(primary),
        scheme.background,
        mode === 'light' ? -1 : 1
      );
      nextScheme.primary = primaryColor;
      nextScheme.primaryForeground = contrastingText(primaryColor);
      nextScheme.ring = primaryColor;
    }
    if (accent) {
      nextScheme.accent = accent;
      nextScheme.accentForeground = contrastingText(accent);
    }
    return nextScheme;
  };

  return {
    ...baseTheme,
    radius,
    typography: fontFamily
      ? {
          ...baseTheme.typography,
          default: { ...baseTheme.typography?.default, fontFamily },
        }
      : baseTheme.typography,
    schemes: {
      ...baseTheme.schemes,
      light: refineScheme(baseTheme.schemes.light, 'light'),
      dark: refineScheme(baseTheme.schemes.dark, 'dark'),
    },
  };
};

/**
 * Creates a complete EmbeddedChat theme from two validated brand colors.
 * Generated foreground tokens are selected by computed WCAG contrast, not by
 * a model, so a provider cannot introduce inaccessible or arbitrary CSS values.
 */
const generateThemeFromColor = (primaryHex, baseTheme, options = {}) => {
  const primary = hexToHsl(primaryHex);
  if (!primary || !baseTheme) return null;

  const accent = hexToHsl(options.accentHex) ?? {
    ...primary,
    hue: (primary.hue + 30) % 360,
  };
  const radius = THEME_RADII.includes(options.radius)
    ? options.radius
    : baseTheme.radius;
  const fontFamily = Object.values(FONT_STACKS).includes(options.fontFamily)
    ? options.fontFamily
    : baseTheme.typography?.default?.fontFamily;

  return {
    ...baseTheme,
    radius,
    typography: fontFamily
      ? {
          ...baseTheme.typography,
          default: { ...baseTheme.typography?.default, fontFamily },
        }
      : baseTheme.typography,
    schemes: {
      light: semanticScheme(primary, accent, 'light'),
      dark: semanticScheme(primary, accent, 'dark'),
    },
  };
};

export default generateThemeFromColor;
