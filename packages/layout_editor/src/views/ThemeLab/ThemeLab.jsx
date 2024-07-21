import React, { useState } from 'react';
import {
  Box,
  Icon,
  Button,
  MinimalSidebar,
  Modal,
  SidebarContent,
  SidebarHeader,
  useToastBarDispatch,
  useTheme,
} from '@embeddedchat/ui-elements';
import useThemeGenerator from '../../hooks/useThemeGenerator';
import { getThemeLabStyles } from './ThemeLab.styles';
import LayoutSetting from './LayoutSetting';
import ThemeSetting from './ThemeSetting';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import useLayoutStore from '../../store/layoutStore';

const ThemeLab = () => {
  const { generatedTheme, generateTheme } = useThemeGenerator();
  const dispatchToastMessage = useToastBarDispatch();
  const styles = getThemeLabStyles(useTheme());
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  const [paletteActive, setPaletteAction] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const handleThemeGeneration = () => {
    generateTheme();
    setThemeModalOpen(true);
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
              <Box css={styles.modalTitle}>
                <Icon name="emoji" size="1.25rem" />
                <Box is="span">Your theme is ready! </Box>
              </Box>
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
