import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import MultiSelect from './MultiSelect';

export default {
  title: 'Components/MultiSelect',
  component: MultiSelect,
};

export const Default = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select options...',
    value: '',
    disabled: false,
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <MultiSelect {...args} />
    </ThemeProvider>
  ),
};
