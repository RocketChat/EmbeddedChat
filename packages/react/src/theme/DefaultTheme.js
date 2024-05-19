const DefaultTheme = {
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  components: {
    ChatBody: {
      styleOverrides: {
        border: 'none',
      },
    },
    ChatInput: {
      styleOverrides: {
        fontWeight: 400,
        color: 'gray',
      },
    },
    Message: {
      classNames: 'myCustomClass',
    },
  },

  schemes: {
    light: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222.2, 84%, 4.9%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(222.2, 84%, 4.9%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(222.2, 84%, 4.9%)',
      primary: 'hsl(221.2, 83.2%, 53.3%)',
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
      ring: 'hsl(221.2, 83.2%, 53.3%)',
    },
    dark: {
      background: 'hsl(222.2, 84%, 4.9%)',
      foreground: 'hsl(210, 40%, 98%)',
      card: 'hsl(222.2, 84%, 4.9%)',
      cardForeground: 'hsl(210, 40%, 98%)',
      popover: 'hsl(222.2, 84%, 4.9%)',
      popoverForeground: 'hsl(210, 40%, 98%)',
      primary: 'hsl(217.2, 91.2%, 59.8%)',
      primaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
      secondary: 'hsl(217.2, 32.6%, 17.5%)',
      secondaryForeground: 'hsl(210, 40%, 98%)',
      muted: 'hsl(217.2, 32.6%, 17.5%)',
      mutedForeground: 'hsl(215, 20.2%, 65.1%)',
      accent: 'hsl(217.2, 32.6%, 17.5%)',
      accentForeground: 'hsl(210, 40%, 98%)',
      destructive: 'hsl(0, 62.8%, 30.6%)',
      destructiveForeground: 'hsl(210, 40%, 98%)',
      border: 'hsl(217.2, 32.6%, 17.5%)',
      input: 'hsl(217.2, 32.6%, 17.5%)',
      ring: 'hsl(224.3, 76.3%, 48%)',
    },
  },

  typography: {
    default: {
      fontFamily:
        '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetca Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    h1: {
      fontSize: 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
      fontWeight: 800,
      lineHeight: 1.1142857142857143,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)',
      fontWeight: 800,
      lineHeight: 1.2222222222222223,
    },
    h3: {
      fontSize: '2.25rem',
      lineHeight: 1.2222222222222223,
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.75rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.5rem',
      lineHeight: 1.5,

      fontWeight: 400,
    },
    h6: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    button: {
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.75,
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  ],
  zIndex: {
    header: 1100,
    popup: 1200,
    modal: 1300,
    tooltip: 1500,
    toastbar: 10001,
  },

  palette: {
    mode: 'light',
    primary: {
      main: '#007FFF',
      light: '#66B2FF',
      dark: '#0059B2',
      contrastText: '#fff',
    },
    divider: '#E7EBF0',
    text: {
      primary: '#1A2027',
      secondary: '#3E5060',
    },
    grey: {
      main: '#E7EBF0',
      contrastText: '#6F7E8C',
    },
    error: {
      main: '#EB0014',
      light: '#FF99A2',
      dark: '#C70011',
      contrastText: '#fff',
    },
    success: {
      main: '#1AA251',
      light: '#6AE79C',
      dark: '#1AA251',
      contrastText: '#fff',
    },
    warning: {
      main: '#DEA500',
      light: '#FFDC48',
      dark: '#AB6800',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#e4e7ea',
      light: '#b6b9bd',
      dark: '#eceef0',
      contrastText: '#1f2329',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    background: {
      surface: '#fff',
      default: '#fff',
      modal: '#fff',
    },
  },
};

export default DefaultTheme;
