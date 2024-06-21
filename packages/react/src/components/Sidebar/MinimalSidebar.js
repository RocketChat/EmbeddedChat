import React from 'react';
import { Box } from '../Box';
import useSidebarStyles from './Sidebar.styles';

const MinimalSidebar = ({ children }) => {
  const styles = useSidebarStyles();

  return (
    <Box css={styles.parent} className="ec-minimal-sidebar">
      {children}
    </Box>
  );
};

export default MinimalSidebar;
