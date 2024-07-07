import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import ListBox from './ListBox';

export default {
  title: 'Components/ListBox',
  component: ListBox,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <ListBox {...args} />
  </ThemeProvider>
);

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  value: 'option1',
  onSelect: (value) => console.log('Selected:', value),
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  value: ['option1', 'option3'],
  multi: true,
  onSelect: (value) => console.log('Selected:', value),
};
