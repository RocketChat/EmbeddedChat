import React, { useState } from "react";
import DefaultTheme from "../theme/DefaultTheme";
import { Box, ThemeProvider } from "@embeddedchat/ui-elements";
import { styles } from "./LayoutEditor.style";
import ChatLayout from "./ChatLayout/ChatLayout";
import ChatHeader from "./ChatHeader/ChatHeader";
import GlobalStyles from "./GlobalStyles";

const LayoutEditor = () => {
  const [mode, setMode] = useState("light");
  return (
    <ThemeProvider theme={DefaultTheme} mode={mode}>
      <Box
        css={styles.embeddedchat(DefaultTheme, mode === "light" ? false : true)}
        className="ec-embedded-chat"
      >
        <GlobalStyles />
        <ChatHeader />
        <ChatLayout />
        <div id="overlay-items" />
      </Box>
    </ThemeProvider>
  );
};

export default LayoutEditor;
