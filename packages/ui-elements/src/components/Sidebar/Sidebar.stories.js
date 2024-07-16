import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import Sidebar from './Sidebar';
import { Box } from '../Box';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Sidebar {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Sidebar Title',
  iconName: 'menu',
  style: { width: '350px' },
  onClose: () => console.log('Sidebar closed'),
  children: (
    <Box>
      <p>This is the sidebar content.</p>
    </Box>
  ),
  footer: (
    <Box>
      <p>This is the sidebar footer.</p>
    </Box>
  ),
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  title: 'Sidebar with Search',
  iconName: 'search',
  style: { width: '350px' },
  onClose: () => console.log('Sidebar closed'),
  searchProps: { isSearch: true, placeholder: 'Search...' },
  children: (
    <Box>
      <p>This is the sidebar content with search functionality.</p>
    </Box>
  ),
  footer: (
    <Box>
      <p>This is the sidebar footer.</p>
    </Box>
  ),
};
