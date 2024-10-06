import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import Divider from './Divider';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Divider',
  component: Divider,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Divider {...args} />
    </ThemeProvider>
  ),
};
