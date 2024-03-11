import React from 'react';
import classes from './Sidebar.module.css';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';

const Sidebar = ({ title, iconName, setShowWindow, children }) => (
  <Box className={classes.sidebar} style={{ padding: '1rem' }}>
    <Box className={classes.sidebarContainer}>
      <Box className={classes.sidebarHeader} style={{ marginBottom: '1rem' }}>
        <h3 style={{ display: 'contents' }}>
          <Icon
            name={iconName}
            size="1.25rem"
            className={classes.sidebarIcon}
          />
          <Box className={classes.sidebarTitle}>{title}</Box>
          <ActionButton onClick={() => setShowWindow(false)} ghost size="small">
            <Icon name="cross" />
          </ActionButton>
        </h3>
      </Box>
      {children}
    </Box>
  </Box>
);
export default Sidebar;
