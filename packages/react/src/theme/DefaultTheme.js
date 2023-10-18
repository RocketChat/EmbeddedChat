import { createTheme } from '@mui/system';

const DefaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiChatBody: {
      styleOverrides: {
        border: 'none',
      },
    },
    MuiChatInput: {
      styleOverrides: {
        fontWeight: 400,
        color: 'gray',
      },
    },
    MuiMessage: {
      className: 'myCustomClass',
    },
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
  typography: {
    fontFamily:
      '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
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
    toastbar: 1400,
    tooltip: 1500,
  },
});

export default DefaultTheme;

