import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import StaticSelect from './StaticSelect';

export default {
  title: 'Components/StaticSelect',
  component: StaticSelect,
};

export const Default = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select an option...',
    value: '',
    disabled: false,
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <StaticSelect {...args} />
    </ThemeProvider>
  ),
};
