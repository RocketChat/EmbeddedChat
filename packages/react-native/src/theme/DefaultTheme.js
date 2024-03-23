const DefaultTheme = {
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
      main: '#9ea2a8',
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
