import { useState } from 'react';
import { useTheme } from '@embeddedchat/ui-elements';
import useLayoutStore from '../store/layoutStore';
import useHeaderItemsStore from '../store/headerItemsStore';
import useMessageItemsStore from '../store/messageItemsStore';
import useChatInputItemsStore from '../store/chatInputItemsStore';

const useThemeGenerator = () => {
  const { theme } = useTheme();
  const [generatedTheme, setGeneratedTheme] = useState(null);

  const { surfaceItems: headerSurfaceItems, menuItems: headerMenuItems } =
    useHeaderItemsStore((state) => ({
      surfaceItems: state.surfaceItems,
      menuItems: state.menuItems,
    }));

  const { surfaceItems: messageSurfaceItems, menuItems: messageMenuItems } =
    useMessageItemsStore((state) => ({
      surfaceItems: state.surfaceItems,
      menuItems: state.menuItems,
    }));

  const { surfaceItems: inputSurfaceItems, formatters } =
    useChatInputItemsStore((state) => ({
      surfaceItems: state.surfaceItems,
      formatters: state.formatters,
    }));

  const { messageView, displayName, sidebarWidth } = useLayoutStore(
    (state) => ({
      messageView: state.messageView,
      displayName: state.displayName,
      sidebarWidth: state.sidebarWidth,
    })
  );

  const generateTheme = () => {
    const finalFormatters = inputSurfaceItems.includes('formatter')
      ? formatters
      : [];
    const addedTheme = {
      ...theme,
      components: {
        Sidebar: {
          styleOverrides: {
            width: sidebarWidth,
          },
        },
        ChatHeader: {
          configOverrides: {
            optionConfig: {
              surfaceItems: headerSurfaceItems,
              menuItems: headerMenuItems,
            },
          },
        },
        MessageToolbox: {
          configOverrides: {
            optionConfig: {
              surfaceItems: messageSurfaceItems,
              menuItems: messageMenuItems,
            },
          },
        },
        ChatInputFormattingToolbar: {
          configOverrides: {
            optionConfig: {
              surfaceItems: inputSurfaceItems,
              formatters: finalFormatters,
            },
          },
        },
      },
      variants: {
        Message: messageView,
        MessageHeader: displayName,
      },
    };
    const themeString = JSON.stringify(addedTheme, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/\\"/g, "'");
    setGeneratedTheme(themeString);
  };

  return {
    generatedTheme,
    generateTheme,
  };
};

export default useThemeGenerator;
