import React from 'react';
import { Box } from '../Box';
import { getSidebarStyles } from './Sidebar.styles';
import { useTheme } from '../../hooks';

const MinimalSidebar = ({ children }) => {
  const { theme } = useTheme();
  const styles = getSidebarStyles(theme);

  return (
    <Box css={styles.sidebarContainer} className="ec-minimal-sidebar">
      {children}
    </Box>
  );
};

export default MinimalSidebar;
