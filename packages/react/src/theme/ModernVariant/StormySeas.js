const StormySeas = {
  radius: '0.2rem',

  commonColors: {
    black: 'hsl(0, 100%, 0%)',
    white: 'hsl(0, 100%, 100%)',
  },

  schemes: {
    light: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222.2, 84%, 4.9%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(222.2, 84%, 4.9%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(222.2, 84%, 4.9%)',
      primary: 'hsl(222.2, 47.4%, 11.2%)',
      primaryForeground: 'hsl(210, 40%, 98%)',
      secondary: 'hsl(210, 40%, 96.1%)',
      secondaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
      muted: 'hsl(210, 40%, 96.1%)',
      mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
      accent: 'hsl(210, 40%, 96.1%)',
      accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
      destructive: 'hsl(0, 84.2%, 60.2%)',
      destructiveForeground: 'hsl(210, 40%, 98%)',
      border: 'hsl(214.3, 31.8%, 91.4%)',
      input: 'hsl(214.3, 31.8%, 91.4%)',
      ring: 'hsl(222.2, 84%, 4.9%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(91, 60.4%, 81.2%)',
      successForeground: 'hsl(90, 61.1%, 14.1%)',
      info: 'hsl(214, 76.4%, 50.2%)',
      infoForeground: 'hsl(214.3, 77.8%, 92.9%)',
    },
    dark: {
      background: 'hsl(240, 10%, 10%)',
      foreground: 'hsl(240, 5%, 90%)',
      card: 'hsl(240, 6%, 10%)',
      cardForeground: 'hsl(240, 5%, 90%)',
      popover: 'hsl(240, 10%, 5%)',
      popoverForeground: 'hsl(240, 5%, 90%)',
      primary: 'hsl(240, 5.9%, 90%)',
      primaryForeground: 'hsl(0, 0%, 0%)',
      secondary: 'hsl(240, 10%, 14%)',
      secondaryForeground: 'hsl(0, 0%, 100%)',
      muted: 'hsl(202, 10%, 15%)',
      mutedForeground: 'hsl(240, 5%, 60%)',
      accent: 'hsl(202, 10%, 15%)',
      accentForeground: 'hsl(240, 5%, 90%)',
      destructive: 'hsl(0, 50%, 30%)',
      destructiveForeground: 'hsl(240, 5%, 90%)',
      border: 'hsl(240, 20%, 18%)',
      input: 'hsl(240, 20%, 18%)',
      ring: 'hsl(240, 5.9%, 90%)',
      warning: 'hsl(48, 96%, 89%)',
      warningForeground: 'hsl(38, 92%, 50%)',
      success: 'hsl(90, 61.1%, 14.1%)',
      successForeground: 'hsl(90, 60%, 90.2%)',
      info: 'hsl(214.3, 77.8%, 92.9%)',
      infoForeground: 'hsl(214.4, 75.8%, 19.4%)',
    },
  },

  contrastParams: {
    light: {
      saturation: 70,
      luminance: 19,
    },
    dark: {
      saturation: 88,
      luminance: 77,
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
    MessageHeader: 'colorize',
    PinnedMessages: {
      viewType: 'Popup',
    },
    ThreadedMessages: {
      viewType: 'Popup',
    },

    MentionedMessages: {
      viewType: 'Popup',
    },
    StarredMessages: {
      viewType: 'Popup',
    },

    FileGallery: {
      viewType: 'Popup',
    },
  },

  components: {
    ChatHeader: {
      configOverrides: {
        optionConfig: {
          surfaceItems: [
            'minmax',
            'close',
            'thread',
            'mentions',
            'starred',
            'pinned',
            'files',
          ],
          menuItems: ['members', 'search', 'rInfo', 'logout'],
        },
      },
    },
  },
};
export default StormySeas;
