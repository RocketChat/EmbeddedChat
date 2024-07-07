import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import Heading from './Heading';

export default {
  title: 'Components/Heading',
  component: Heading,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Heading {...args} />
  </ThemeProvider>
);

export const Level1 = Template.bind({});
Level1.args = {
  level: 1,
  children: 'Heading Level 1',
};

export const Level2 = Template.bind({});
Level2.args = {
  level: 2,
  children: 'Heading Level 2',
};

export const Level3 = Template.bind({});
Level3.args = {
  level: 3,
  children: 'Heading Level 3',
};

export const Level4 = Template.bind({});
Level4.args = {
  level: 4,
  children: 'Heading Level 4',
};

export const Level5 = Template.bind({});
Level5.args = {
  level: 5,
  children: 'Heading Level 5',
};

export const Level6 = Template.bind({});
Level6.args = {
  level: 6,
  children: 'Heading Level 6',
};
