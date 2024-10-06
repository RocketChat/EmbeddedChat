import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import { ActionButton } from '.';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/ActionButton',
  component: ActionButton,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    color: 'primary',
    icon: 'mic',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};

export const Secondary = {
  args: {
    color: 'secondary',
    icon: 'mic',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};

export const Ghost = {
  args: {
    ghost: true,
    icon: 'cross',
    disabled: false,
    color: 'primary',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};
