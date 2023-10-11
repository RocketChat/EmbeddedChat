import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { ActionButton } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import DarkTheme from '../../theme/DarkTheme'; // Import your DarkTheme


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

// Add new stories with DarkTheme
export const DarkPrimary = {
  args: {
    color: 'primary',
    icon: 'mic',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};

export const DarkSecondary = {
  args: {
    color: 'secondary',
    icon: 'mic',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};

export const DarkGhost = {
  args: {
    ghost: true,
    icon: 'cross',
    disabled: false,
    color: 'primary',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <ActionButton {...args} />
    </ThemeProvider>
  ),
};