import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import { Icon } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Icon',
  component: Icon,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const GoogleIcon = {
  args: {
    name: 'google',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Icon {...args} />
    </ThemeProvider>
  ),
};

export const CustomStyle = {
  args: {
    name: 'google',
    style: { color: 'red' },
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Icon {...args} />
    </ThemeProvider>
  ),
};

export const CustomSize = {
  args: {
    name: 'google',
    size: '64px',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Icon {...args} />
    </ThemeProvider>
  ),
};
