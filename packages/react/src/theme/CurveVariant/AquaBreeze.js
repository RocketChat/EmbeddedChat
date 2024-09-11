const AquaBreeze = {
  radius: '1.5rem',
  commonColors: {
    black: 'hsl(0, 0%, 0%)',
    white: 'hsl(0, 0%, 100%)',
  },
  schemes: {
    light: {
      background: 'hsl(192, 52%, 96%)',
      foreground: 'hsl(192, 5%, 10%)',
      card: 'hsl(192, 50%, 96%)',
      cardForeground: 'hsl(192, 5%, 15%)',
      popover: 'hsl(192, 52%, 96%)',
      popoverForeground: 'hsl(192, 95%, 10%)',
      primary: 'hsl(192, 46%, 80%)',
      primaryForeground: 'hsl(0, 0%, 0%)',
      secondary: 'hsl(192, 30%, 90%)',
      secondaryForeground: 'hsl(0, 0%, 0%)',
      muted: 'hsl(154, 30%, 95%)',
      mutedForeground: 'hsl(192, 5%, 40%)',
      accent: 'hsl(154, 30%, 90%)',
      accentForeground: 'hsl(192, 5%, 15%)',
      destructive: 'hsl(0, 52%, 50%)',
      destructiveForeground: 'hsl(192, 5%, 96%)',
      border: 'hsl(192, 30%, 82%)',
      input: 'hsl(192, 30%, 50%)',
      ring: 'hsl(192, 46%, 80%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(91, 60.4%, 81.2%)',
      successForeground: 'hsl(90, 61.1%, 14.1%)',
      info: 'hsl(214, 76.4%, 50.2%)',
      infoForeground: 'hsl(214.3, 77.8%, 92.9%)',
    },
    dark: {
      background: 'hsl(192, 50%, 10%)',
      foreground: 'hsl(192, 5%, 96%)',
      card: 'hsl(192, 50%, 10%)',
      cardForeground: 'hsl(192, 5%, 96%)',
      popover: 'hsl(192, 50%, 5%)',
      popoverForeground: 'hsl(192, 5%, 96%)',
      primary: 'hsl(192, 46%, 80%)',
      primaryForeground: 'hsl(0, 0%, 0%)',
      secondary: 'hsl(192, 30%, 20%)',
      secondaryForeground: 'hsl(0, 0%, 100%)',
      muted: 'hsl(154, 30%, 25%)',
      mutedForeground: 'hsl(192, 5%, 65%)',
      accent: 'hsl(154, 30%, 25%)',
      accentForeground: 'hsl(192, 5%, 95%)',
      destructive: 'hsl(0, 52%, 50%)',
      destructiveForeground: 'hsl(192, 5%, 96%)',
      border: 'hsl(192, 30%, 50%)',
      input: 'hsl(192, 30%, 50%)',
      ring: 'hsl(192, 46%, 80%)',
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

  variants: {
    Message: 'bubble',
  },

  components: {
    MessageToolbox: {
      configOverrides: {
        optionConfig: {
          surfaceItems: ['reaction', 'reply', 'quote', 'star'],
          menuItems: ['pin', 'edit', 'delete', 'report'],
        },
      },
    },
  },
};
export default AquaBreeze;
