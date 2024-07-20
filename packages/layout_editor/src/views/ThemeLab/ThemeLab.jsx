import React, { useState } from 'react';
import {
  Box,
  Button,
  MinimalSidebar,
  SidebarContent,
  SidebarHeader,
  useTheme,
} from '@embeddedchat/ui-elements';
import useLayoutStore from '../../store/layoutStore';
import { getThemeLabStyles } from './ThemeLab.styles';
import LayoutSetting from './LayoutSetting';
import ThemeSetting from './ThemeSetting';

const ThemeLab = () => {
  const styles = getThemeLabStyles(useTheme());
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  const [paletteActive, setPaletteAction] = useState(true);

  return (
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
            <Button type="secondary" style={{ width: '100%' }}>
              Generate Theme
            </Button>
          </Box>
        </SidebarContent>
      </MinimalSidebar>
    </Box>
  );
};

export default ThemeLab;
