const MintMeadow = {
  radius: '0.2rem',

  commonColors: {
    black: 'hsl(0, 100%, 0%)',
    white: 'hsl(0, 100%, 100%)',
  },

  schemes: {
    light: {
      background: 'hsl(98, 28%, 95%)',
      foreground: 'hsl(98, 5%, 8%)',
      card: 'hsl(98, 28%, 90%)',
      cardForeground: 'hsl(98, 5%, 10%)',
      popover: 'hsl(98, 28%, 95%)',
      popoverForeground: 'hsl(98, 95%, 8%)',
      primary: 'hsl(98, 54%, 63%)',
      primaryForeground: 'hsl(0, 0%, 0%)',
      secondary: 'hsl(98, 28%, 70%)',
      secondaryForeground: 'hsl(0, 0%, 0%)',
      muted: 'hsl(60, 28%, 85%)',
      mutedForeground: 'hsl(98, 5%, 35%)',
      accent: 'hsl(60, 28%, 80%)',
      accentForeground: 'hsl(98, 5%, 10%)',
      destructive: 'hsl(0, 50%, 30%)',
      destructiveForeground: 'hsl(98, 5%, 90%)',
      border: 'hsl(98, 28%, 50%)',
      input: 'hsl(98, 28%, 18%)',
      ring: 'hsl(98, 54%, 63%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(91, 60.4%, 81.2%)',
      successForeground: 'hsl(90, 61.1%, 14.1%)',
      info: 'hsl(214, 76.4%, 50.2%)',
      infoForeground: 'hsl(214.3, 77.8%, 92.9%)',
    },
    dark: {
      background: 'hsl(98, 28%, 8%)',
      foreground: 'hsl(98, 5%, 90%)',
      card: 'hsl(98, 28%, 8%)',
      cardForeground: 'hsl(98, 5%, 90%)',
      popover: 'hsl(98, 28%, 5%)',
      popoverForeground: 'hsl(98, 5%, 90%)',
      primary: 'hsl(98, 54%, 63%)',
      primaryForeground: 'hsl(0, 0%, 0%)',
      secondary: 'hsl(98, 28%, 10%)',
      secondaryForeground: 'hsl(0, 0%, 100%)',
      muted: 'hsl(60, 28%, 15%)',
      mutedForeground: 'hsl(98, 5%, 60%)',
      accent: 'hsl(60, 28%, 15%)',
      accentForeground: 'hsl(98, 5%, 90%)',
      destructive: 'hsl(0, 50%, 30%)',
      destructiveForeground: 'hsl(98, 5%, 90%)',
      border: 'hsl(98, 28%, 18%)',
      input: 'hsl(98, 28%, 18%)',
      ring: 'hsl(98, 54%, 63%)',
      warning: 'hsl(48, 96%, 89%)',
      warningForeground: 'hsl(38, 92%, 50%)',
      success: 'hsl(90, 61.1%, 14.1%)',
      successForeground: 'hsl(90, 60%, 90.2%)',
      info: 'hsl(214.3, 77.8%, 92.9%)',
      infoForeground: 'hsl(214.4, 75.8%, 19.4%)',
    },
  },

  typography: {
    default: {
      fontFamily: "'Times New Roman', serif",
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

export default MintMeadow;
