import { ThemeProvider } from '@emotion/react';
import React from 'react';
import DefaultTheme from '../../theme/DefaultTheme';
import { Button } from '../Button';
import { Throbber } from '.';

export default {
  title: 'Throbber',
  component: Throbber,
};

const Template = (args) => <Throbber {...args} />;

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  size: '16px',
};

const Default2 = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Button disabled>
      <Throbber {...args} />
    </Button>
  </ThemeProvider>
);
export const InsideButton = Default2.bind({});
InsideButton.args = {
  size: '16px',
};
