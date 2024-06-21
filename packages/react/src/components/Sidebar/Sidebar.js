import React from 'react';
import { Box } from '../Box';
import useSidebarStyles from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({
  title,
  iconName,
  onClose,
  children,
  searchProps = {},
  footer,
}) => {
  const styles = useSidebarStyles();

  return (
    <Box css={styles.parent} className="ec-sidebar">
      <SidebarHeader title={title} iconName={iconName} onClose={onClose} />
      <SidebarContent searchProps={searchProps}>{children}</SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Box>
  );
};

export default Sidebar;
