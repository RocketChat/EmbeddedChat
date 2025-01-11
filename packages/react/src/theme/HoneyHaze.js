const HoneyHaze = {
  radius: '0.2rem',

  commonColors: {
    black: 'hsl(0, 0%, 0%)',
    white: 'hsl(0, 0%, 100%)',
  },

  schemes: {
    light: {
      background: 'hsl(45, 90%, 95%)',
      foreground: 'hsl(45, 20%, 20%)',
      card: 'hsl(45, 85%, 90%)',
      cardForeground: 'hsl(45, 20%, 25%)',
      popover: 'hsl(45, 90%, 95%)',
      popoverForeground: 'hsl(45, 20%, 15%)',
      primary: 'hsl(45, 80%, 50%)',
      primaryForeground: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(45, 50%, 75%)',
      secondaryForeground: 'hsl(45, 20%, 20%)',
      muted: 'hsl(35, 25%, 85%)',
      mutedForeground: 'hsl(45, 20%, 40%)',
      accent: 'hsl(35, 30%, 80%)',
      accentForeground: 'hsl(45, 20%, 25%)',
      destructive: 'hsl(0, 63%, 50%)',
      destructiveForeground: 'hsl(45, 20%, 90%)',
      border: 'hsl(45, 50%, 75%)',
      input: 'hsl(45, 50%, 50%)',
      ring: 'hsl(45, 80%, 50%)',
      warning: 'hsl(38, 90%, 55%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(120, 50%, 80%)',
      successForeground: 'hsl(120, 50%, 20%)',
      info: 'hsl(220, 70%, 50%)',
      infoForeground: 'hsl(220, 70%, 90%)',
    },
    dark: {
      background: 'hsl(45, 30%, 10%)',
      foreground: 'hsl(45, 20%, 90%)',
      card: 'hsl(45, 30%, 12%)',
      cardForeground: 'hsl(45, 20%, 85%)',
      popover: 'hsl(45, 30%, 8%)',
      popoverForeground: 'hsl(45, 20%, 90%)',
      primary: 'hsl(45, 80%, 50%)',
      primaryForeground: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(45, 30%, 25%)',
      secondaryForeground: 'hsl(0, 0%, 100%)',
      muted: 'hsl(35, 25%, 25%)',
      mutedForeground: 'hsl(45, 20%, 65%)',
      accent: 'hsl(35, 30%, 25%)',
      accentForeground: 'hsl(45, 20%, 90%)',
      destructive: 'hsl(0, 63%, 50%)',
      destructiveForeground: 'hsl(45, 20%, 90%)',
      border: 'hsl(45, 30%, 50%)',
      input: 'hsl(45, 30%, 50%)',
      ring: 'hsl(45, 80%, 50%)',
      warning: 'hsl(48, 96%, 89%)',
      warningForeground: 'hsl(38, 90%, 55%)',
      success: 'hsl(120, 50%, 20%)',
      successForeground: 'hsl(120, 50%, 90%)',
      info: 'hsl(220, 70%, 90%)',
      infoForeground: 'hsl(220, 70%, 20%)',
    },
  },

  typography: {
    default: {
      fontFamily: "'Verdana', sans-serif",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    h1: {
      fontSize: '2.625rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },

  shadows: [
    'none',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  ],
};

export default HoneyHaze;
