import React from 'react';
import { ThemeProvider } from '@emotion/react';
import DefaultTheme from '../../theme/DefaultTheme';
import MessageEmoji from './MessageEmoji';

export default {
  title: 'Components/MessageEmoji',
  component: MessageEmoji,
};

export const Default = {
  args: {
    body: 'Hello, :smile:!',
    size: '1.5rem', // Specify the size based on markdownStyles
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <MessageEmoji {...args} />
    </ThemeProvider>
  ),
};

