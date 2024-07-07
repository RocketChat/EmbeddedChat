import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import Tooltip from './Tooltip';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
};

const Template = (args) => (
  <ThemeProvider theme={DefaultTheme}>
    <Tooltip {...args} />
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  children: (
    <ActionButton square ghost onClick={() => {}}>
      <Icon name="pin" size="1.25rem" />
    </ActionButton>
  ),
  text: 'Pinned',
  position: 'bottom',
};
