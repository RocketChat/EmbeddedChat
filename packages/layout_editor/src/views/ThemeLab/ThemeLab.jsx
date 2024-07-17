import React from 'react';
import { Box, MinimalSidebar, SidebarHeader } from '@embeddedchat/ui-elements';
import useLayoutStore from '../../store/layoutStore';
import { useThemeLabStyles } from './ThemeLab.styles';

const ThemeLab = () => {
  const styles = useThemeLabStyles();
  const setThemeLabOpen = useLayoutStore((state) => state.setThemeLabOpen);
  return (
    <Box>
      <MinimalSidebar>
        <SidebarHeader
          onClose={() => setThemeLabOpen(false)}
          title="Theme Lab"
          iconName="cog"
        />
      </MinimalSidebar>
    </Box>
  );
};

export default ThemeLab;
