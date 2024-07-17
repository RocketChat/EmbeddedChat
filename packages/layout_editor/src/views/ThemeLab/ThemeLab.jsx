import React, { useState } from 'react';
import {
  Box,
  MinimalSidebar,
  SidebarContent,
  SidebarHeader,
  useTheme,
} from '@embeddedchat/ui-elements';
import useLayoutStore from '../../store/layoutStore';
import { useThemeLabStyles } from './ThemeLab.styles';
import PaletteSetting from './PaletteSetting';
import LayoutSetting from './LayoutSetting';

const ThemeLab = () => {
  const styles = useThemeLabStyles(useTheme());
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  const [paletteActive, setPaletteAction] = useState(true);

  return (
    <Box>
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
              Palette
            </Box>
            <Box
              is="span"
              css={[styles.section, !paletteActive && styles.sectionActive]}
              onClick={() => setPaletteAction(false)}
            >
              Layout
            </Box>
          </Box>

          {paletteActive ? <PaletteSetting /> : <LayoutSetting />}
        </SidebarContent>
      </MinimalSidebar>
    </Box>
  );
};

export default ThemeLab;
