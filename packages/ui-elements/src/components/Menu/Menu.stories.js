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
        section: 'activity',
      },
      {
        id: 'mentions',
        label: 'Mentions',
        icon: 'at',
        section: 'activity',
      },
      {
        id: 'members',
        label: 'Members',
        icon: 'members',
        section: 'activity',
      },
      {
        id: 'files',
        label: 'Files',
        icon: 'clip',
        section: 'content',
      },
      {
        id: 'starred',
        label: 'Starred',
        icon: 'star',
        section: 'content',
      },
      {
        id: 'pinned',
        label: 'Pinned',
        icon: 'pin',
        section: 'content',
      },
      {
        id: 'search',
        label: 'Search',
        icon: 'magnifier',
        section: 'discovery',
      },
      {
        id: 'rInfo',
        label: 'Room Information',
        icon: 'info',
        section: 'discovery',
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: 'reply-directly',
        color: 'error',
        section: 'session',
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
