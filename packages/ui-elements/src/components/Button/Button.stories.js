import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { Button } from '.';
import DefaultTheme from '../../theme/DefaultTheme';
import { ModeProvider } from '../../hooks/useMode';

export default {
  title: 'Components/Button',
  component: Button,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <ModeProvider mode="dark">
      <Button {...args}>Click Me</Button>
    </ModeProvider>
  </ThemeProvider>
);

export const Primary = {
  args: {
    type: 'primary',
  },
  render: (args) => <Template {...args} />,
};

export const Secondary = {
  args: {
    type: 'secondary',
  },
  render: (args) => <Template {...args} />,
};

export const Large = {
  args: {
    type: 'primary',
    size: 'large',
  },
  render: (args) => <Template {...args} />,
};

export const Small = {
  args: {
    type: 'primary',
    size: 'small',
  },
  render: (args) => <Template {...args} />,
};
