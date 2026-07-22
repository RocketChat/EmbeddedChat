const AITheme = {
  radius: '0.75rem',

  commonColors: {
    black: 'hsl(240, 25%, 4%)',
    white: 'hsl(210, 40%, 98%)',
  },

  schemes: {
    light: {
      background: 'hsl(210, 40%, 98%)',
      foreground: 'hsl(228, 35%, 12%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(228, 35%, 12%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(228, 35%, 12%)',
      primary: 'hsl(252, 76%, 58%)',
      primaryForeground: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(220, 35%, 94%)',
      secondaryForeground: 'hsl(228, 35%, 18%)',
      muted: 'hsl(220, 35%, 94%)',
      mutedForeground: 'hsl(225, 18%, 42%)',
      accent: 'hsl(174, 55%, 90%)',
      accentForeground: 'hsl(180, 55%, 20%)',
      destructive: 'hsl(0, 72%, 51%)',
      destructiveForeground: 'hsl(0, 0%, 100%)',
      border: 'hsl(220, 24%, 86%)',
      input: 'hsl(220, 24%, 86%)',
      ring: 'hsl(252, 76%, 58%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(160, 64%, 42%)',
      successForeground: 'hsl(160, 70%, 96%)',
      info: 'hsl(190, 85%, 42%)',
      infoForeground: 'hsl(190, 80%, 95%)',
    },
    dark: {
      background: 'hsl(240, 27%, 7%)',
      foreground: 'hsl(210, 40%, 96%)',
      card: 'hsl(240, 24%, 10%)',
      cardForeground: 'hsl(210, 40%, 96%)',
      popover: 'hsl(240, 25%, 9%)',
      popoverForeground: 'hsl(210, 40%, 96%)',
      primary: 'hsl(252, 84%, 69%)',
      primaryForeground: 'hsl(240, 30%, 10%)',
      secondary: 'hsl(238, 22%, 16%)',
      secondaryForeground: 'hsl(210, 40%, 96%)',
      muted: 'hsl(238, 22%, 14%)',
      mutedForeground: 'hsl(220, 18%, 68%)',
      accent: 'hsl(180, 42%, 18%)',
      accentForeground: 'hsl(174, 70%, 82%)',
      destructive: 'hsl(0, 62%, 42%)',
      destructiveForeground: 'hsl(210, 40%, 96%)',
      border: 'hsl(240, 22%, 20%)',
      input: 'hsl(240, 22%, 20%)',
      ring: 'hsl(174, 70%, 62%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(160, 58%, 30%)',
      successForeground: 'hsl(160, 70%, 90%)',
      info: 'hsl(190, 65%, 32%)',
      infoForeground: 'hsl(190, 80%, 90%)',
    },
  },

  contrastParams: {
    light: {
      saturation: 70,
      luminance: 20,
    },
    dark: {
      saturation: 85,
      luminance: 75,
    },
  },

  typography: {
    default: {
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    h1: { fontSize: '2.25rem', fontWeight: 800 },
    h2: { fontSize: '1.75rem', fontWeight: 750 },
    h3: { fontSize: '1.4rem', fontWeight: 650 },
    h4: { fontSize: '1.1rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem', fontWeight: 600 },
  },

  shadows: [
    'none',
    '0 1px 2px hsla(240, 30%, 4%, 0.28), 0 0 0 1px hsla(252, 84%, 69%, 0.04)',
    '0 16px 40px hsla(240, 30%, 4%, 0.36), 0 0 32px hsla(252, 84%, 69%, 0.1)',
  ],
};

export default AITheme;
