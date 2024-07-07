import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import { Button } from '.';
import DefaultTheme from '../../theme/DefaultTheme';

export default {
  title: 'Components/Button',
  component: Button,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Button {...args}>Click Me</Button>
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
