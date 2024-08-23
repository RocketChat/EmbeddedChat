import React from 'react';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import ChatLayout from './ChatLayout/ChatLayout';
import ChatHeader from './ChatHeader/ChatHeader';
import GlobalStyles from './GlobalStyles';
import useLayoutStore from '../store/layoutStore';
import ThemeLab from './ThemeLab/ThemeLab';
import { getEditorStyles } from './LayoutEditor.style';

const LayoutEditor = () => {
  const themeLabOpen = useLayoutStore((state) => state.themeLabOpen);
  const { theme } = useTheme();
  const styles = getEditorStyles(theme);

  return (
    <Box css={styles.layoutEditor}>
      <Box css={styles.embeddedchat} className="ec-embedded-chat">
        <GlobalStyles />
        <ChatHeader />
        <ChatLayout />
        <div id="overlay-items" />
      </Box>
      {themeLabOpen && <ThemeLab />}
    </Box>
  );
};

export default LayoutEditor;
