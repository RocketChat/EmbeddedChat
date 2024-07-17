import React, { useState } from 'react';
import DefaultTheme from '../theme/DefaultTheme';
import { Box, ThemeProvider } from '@embeddedchat/ui-elements';
import { styles } from './LayoutEditor.style';
import ChatLayout from './ChatLayout/ChatLayout';
import ChatHeader from './ChatHeader/ChatHeader';
import GlobalStyles from './GlobalStyles';
import useLayoutStore from '../store/layoutStore';
import ThemeLab from './ThemeLab/ThemeLab';

const LayoutEditor = () => {
  const [mode, setMode] = useState('light');
  const themeLabOpen = useLayoutStore((state) => state.themeLabOpen);
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
        {themeLabOpen && <ThemeLab />}
      </Box>
    </ThemeProvider>
  );
};

export default LayoutEditor;
