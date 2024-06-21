import React from 'react';
import { Box } from '../Box';

const SidebarFooter = ({ children, ...props }) => (
  <Box {...props}>{children}</Box>
);

export default SidebarFooter;
