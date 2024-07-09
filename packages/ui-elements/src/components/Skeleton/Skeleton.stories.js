import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';

import { Skeleton } from '.';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Skeleton {...args} />
  </ThemeProvider>
);

export const RectVariant = Template.bind({});
RectVariant.args = {
  variant: 'rect',
  width: '50%',
  height: 100,
};

export const CircleVariant = Template.bind({});
CircleVariant.args = {
  variant: 'circle',
  width: 16,
  height: 16,
};
