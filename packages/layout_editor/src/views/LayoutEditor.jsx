import React, { useState } from 'react';
import DefaultTheme from '../theme/DefaultTheme';
import { Box, Sidebar, ThemeProvider } from '@embeddedchat/ui-elements';
import { styles } from './LayoutEditor.style';
import ChatLayout from './ChatLayout/ChatLayout';
import ChatHeader from './ChatHeader/ChatHeader';
import GlobalStyles from './GlobalStyles';

const LayoutEditor = () => {
  const [mode, setMode] = useState('light');
  const [isThemeLab, setIsThemeLab] = useState(true);
  return (
    <ThemeProvider theme={DefaultTheme} mode={mode}>
      <Box css={styles.layoutEditor}>
        <Box
          css={styles.embeddedchat(
            DefaultTheme,
            mode === 'light' ? false : true
          )}
          className="ec-embedded-chat"
        >
          <GlobalStyles />
          <ChatHeader />
          <ChatLayout />
          <div id="overlay-items" />
        </Box>
        {isThemeLab && (
          <Box css={styles.themeLab}>
            <Sidebar onClose={() => setIsThemeLab(false)}></Sidebar>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default LayoutEditor;
