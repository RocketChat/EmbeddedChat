import React from 'react';
import { ThemeProvider } from '../../context/ThemeContextProvider';
import DefaultTheme from '../../theme/DefaultTheme';
import { Menu as MenuComponent } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/Menu',
  component: MenuComponent,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  args: {
    options: [
      {
        id: 'thread',
        label: 'Threads',
        icon: 'thread',
      },
      {
        id: 'mentions',
        label: 'Mentions',
        icon: 'at',
      },
      {
        id: 'members',
        label: 'Members',
        icon: 'members',
      },
      {
        id: 'files',
        label: 'Files',
        icon: 'clip',
      },
      {
        id: 'starred',
        label: 'Starred',
        icon: 'star',
      },
      {
        id: 'pinned',
        label: 'Pinned',
        icon: 'pin',
      },
      {
        id: 'search',
        label: 'Search',
        icon: 'magnifier',
      },
      {
        id: 'rInfo',
        label: 'Room Information',
        icon: 'info',
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: 'reply-directly',
        color: 'error',
      },
    ],
    anchor: 'left bottom',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <MenuComponent {...args} />
    </ThemeProvider>
  ),
};
