import React from "react";
import DefaultTheme from "../theme/DefaultTheme";
import { Box, ThemeProvider } from "@embeddedchat/ui-elements";
import { styles } from "./LayoutEditor.style";
import ChatLayout from "./ChatLayout/ChatLayout";
import ChatHeader from "./ChatHeader/ChatHeader";
import GlobalStyles from "./GlobalStyles";

const LayoutEditor = () => (
  <ThemeProvider theme={DefaultTheme} mode="light">
    <Box
      css={styles.embeddedchat(DefaultTheme, false)}
      className="ec-embedded-chat"
    >
      <GlobalStyles />
      <ChatHeader />
      <ChatLayout />
      <div id="overlay-items" />
    </Box>
  </ThemeProvider>
);

export default LayoutEditor;
