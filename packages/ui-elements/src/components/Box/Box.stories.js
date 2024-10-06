import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import Box from './Box';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Box',
  component: Box,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Div = {
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Box {...args}>Hello, this is div</Box>
    </ThemeProvider>
  ),
};

export const Span = {
  args: {
    is: 'span',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Box {...args}>Hello, this is span</Box>
    </ThemeProvider>
  ),
};
