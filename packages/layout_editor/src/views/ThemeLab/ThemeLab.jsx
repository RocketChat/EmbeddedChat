import React, { useState } from 'react';
import {
  Box,
  Icon,
  Button,
  MinimalSidebar,
  Modal,
  SidebarContent,
  SidebarHeader,
  useTheme,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import useLayoutStore from '../../store/layoutStore';
import { getThemeLabStyles } from './ThemeLab.styles';
import LayoutSetting from './LayoutSetting';
import ThemeSetting from './ThemeSetting';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useHeaderItemsStore from '../../store/headerItemsStore';
import useMessageItemsStore from '../../store/messageItemsStore';
import useChatInputItemsStore from '../../store/chatInputItemsStore';

const ThemeLab = () => {
  const { theme } = useTheme();
  const dispatchToastMessage = useToastBarDispatch();
  const styles = getThemeLabStyles(useTheme());
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  const [paletteActive, setPaletteAction] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
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

  const { messageView, displayName } = useLayoutStore((state) => ({
    messageView: state.messageView,
    displayName: state.displayName,
  }));

  const handleThemeGeneration = () => {
    setThemeModalOpen(true);
    const finalFormatters = inputSurfaceItems.includes('formatter')
      ? formatters
      : [];
    const addedTheme = {
      ...theme,
      components: {
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

  const handleCopyToClipboard = () => {
    if (generatedTheme) {
      navigator.clipboard
        .writeText(generatedTheme)
        .then(() => {
          dispatchToastMessage({
            type: 'success',
            message: 'Theme copied to clipboard.',
          });
        })
        .catch((err) => {
          dispatchToastMessage({
            type: 'error',
            message: 'Copy to clipboard failed.',
          });
        });
    }
  };

  return (
    <>
      <Box style={{ width: '350px' }}>
        <MinimalSidebar>
          <SidebarHeader
            onClose={() => setThemeLabOpen(false)}
            title="Theme Lab"
            iconName="cog"
          />
          <SidebarContent>
            <Box css={styles.sectionContainer}>
              <Box
                is="span"
                css={[styles.section, paletteActive && styles.sectionActive]}
                onClick={() => setPaletteAction(true)}
              >
                Theme
              </Box>
              <Box
                is="span"
                css={[styles.section, !paletteActive && styles.sectionActive]}
                onClick={() => setPaletteAction(false)}
              >
                Layout
              </Box>
            </Box>

            {paletteActive ? <ThemeSetting /> : <LayoutSetting />}
            <Box css={styles.btn}>
              <Button
                type="secondary"
                style={{ width: '100%' }}
                onClick={handleThemeGeneration}
              >
                Generate Theme 👀
              </Button>
            </Box>
          </SidebarContent>
        </MinimalSidebar>
      </Box>

      {themeModalOpen && (
        <Modal onClose={() => setThemeModalOpen(false)}>
          <Modal.Header>
            <Modal.Title>
              <Icon name="emoji" size="1.25rem" />
              Your theme is ready!
            </Modal.Title>
            <Modal.Close onClick={() => setThemeModalOpen(false)} />
          </Modal.Header>
          <Modal.Content>
            <Box css={styles.syntaxBox}>
              <SyntaxHighlighter
                language="javascript"
                style={dracula}
                css={styles.syntaxBox}
              >
                {generatedTheme}
              </SyntaxHighlighter>
              <Icon
                name="copy"
                size="1.25rem"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  cursor: 'pointer',
                }}
                onClick={handleCopyToClipboard}
              />
            </Box>
          </Modal.Content>
          <Modal.Footer>
            <Box css={styles.closeBtn}>
              <Button type="secondary" onClick={() => setThemeModalOpen(false)}>
                Close
              </Button>
            </Box>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ThemeLab;
