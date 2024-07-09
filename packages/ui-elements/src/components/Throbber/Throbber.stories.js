import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import { Throbber } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Throbber',
  component: Throbber,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Throbber />
    </ThemeProvider>
  ),
};

export const Disabled = {
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Throbber disabled />
    </ThemeProvider>
  ),
};
