import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import { CheckBox } from '.';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/CheckBox',
  component: CheckBox,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  args: {
    checked: true,
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <CheckBox {...args} />
    </ThemeProvider>
  ),
};
