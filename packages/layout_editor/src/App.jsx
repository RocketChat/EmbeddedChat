import React from 'react';
import LayoutEditor from './views/LayoutEditor';
import { ThemeProvider, ToastBarProvider } from '@embeddedchat/ui-elements';
import DefaultTheme from './theme/DefaultTheme';

const App = () => {
  return (
    <ThemeProvider theme={DefaultTheme} mode="light">
      <ToastBarProvider position="bottom right">
        <LayoutEditor />
      </ToastBarProvider>
    </ThemeProvider>
  );
};

export default App;
