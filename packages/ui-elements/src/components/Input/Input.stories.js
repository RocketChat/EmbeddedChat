import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import { Input } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Input',
  component: Input,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Text = {
  args: {
    type: 'text',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Input {...args} />
    </ThemeProvider>
  ),
};

export const Password = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <Input {...args} />
    </ThemeProvider>
  ),
};
