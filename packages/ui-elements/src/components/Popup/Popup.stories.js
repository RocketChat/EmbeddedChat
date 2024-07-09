import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import Popup from './Popup';
import { Box } from '../Box';

export default {
  title: 'Components/Popup',
  component: Popup,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Popup {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <Box>
      <p>This is a default popup content.</p>
    </Box>
  ),
  onClose: () => console.log('Popup closed'),
};

export const WithHeader = Template.bind({});
WithHeader.args = {
  isPopupHeader: true,
  title: 'Popup Title',
  iconName: 'info',
  searchProps: { placeholder: 'Search...' },
  children: (
    <Box>
      <p>This is a popup with a header.</p>
    </Box>
  ),
  onClose: () => console.log('Popup closed'),
};
