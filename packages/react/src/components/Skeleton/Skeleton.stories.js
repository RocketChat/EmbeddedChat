import React from 'react';

import { Skeleton } from '.';

export default {
  title: 'Skeleton',
  component: Skeleton,
};

const Template = (args) => <Skeleton {...args} />;

export const Default = Template.bind({});

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
