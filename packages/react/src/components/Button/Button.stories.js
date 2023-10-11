import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { Button } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import DarkTheme from '../../theme/DarkTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Button',
  component: Button,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const DefaultThemePrimary = {
  args: {
    color: 'primary',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Button {...args}>Click Me (Default Theme)</Button>
    </ThemeProvider>
  ),
};

export const DefaultThemeSecondary = {
  args: {
    color: 'secondary',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Button {...args}>Click Me (Default Theme)</Button>
    </ThemeProvider>
  ),
};

export const DefaultThemeLarge = {
  args: {
    color: 'primary',
    size: 'large',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Button {...args}>Click Me (Default Theme)</Button>
    </ThemeProvider>
  ),
};

export const DefaultThemeSmall = {
  args: {
    color: 'primary',
    size: 'small',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Button {...args}>Click Me (Default Theme)</Button>
    </ThemeProvider>
  ),
};

export const DarkThemePrimary = {
  args: {
    color: 'primary',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <Button {...args}>Click Me (Dark Theme)</Button>
    </ThemeProvider>
  ),
};

export const DarkThemeSecondary = {
  args: {
    color: 'secondary',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <Button {...args}>Click Me (Dark Theme)</Button>
    </ThemeProvider>
  ),
};

export const DarkThemeLarge = {
  args: {
    color: 'primary',
    size: 'large',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <Button {...args}>Click Me (Dark Theme)</Button>
    </ThemeProvider>
  ),
};

export const DarkThemeSmall = {
  args: {
    color: 'primary',
    size: 'small',
  },
  render: (args) => (
    <ThemeProvider theme={DarkTheme}>
      <Button {...args}>Click Me (Dark Theme)</Button>
    </ThemeProvider>
  ),
};