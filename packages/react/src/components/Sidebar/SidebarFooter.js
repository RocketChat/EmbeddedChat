import React from 'react';
import { Box } from '../Box';
import useSidebarStyles from './Sidebar.styles';

const SidebarFooter = ({ children }) => {
  const styles = useSidebarStyles();

  return <Box css={styles.footer}>{children}</Box>;
};

export default SidebarFooter;
