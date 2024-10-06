import React from 'react';
import { Box } from '../Box';
import { useComponentOverrides, useTheme } from '../../hooks';
import { getSidebarStyles } from './Sidebar.styles';
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
  style = {},
}) => {
  const { theme } = useTheme();
  const styles = getSidebarStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides('Sidebar');

  return (
    <Box
      css={styles.sidebarContainer}
      className={`ec-sidebar ${classNames}`}
      style={{ ...style, ...styleOverrides }}
    >
      <SidebarHeader title={title} iconName={iconName} onClose={onClose} />
      <SidebarContent searchProps={searchProps}>{children}</SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Box>
  );
};

export default Sidebar;
