import React from 'react';
import { ThemeProvider } from '@emotion/react';
import DefaultTheme from '../../theme/DefaultTheme';
import EmojiReaction from './EmojiReaction';

export default {
  title: 'Components/EmojiReaction',
  component: EmojiReaction,
};

export const Default = {
  args: {
    body: 'Hello, :smile:!',
    size: '1.5rem',
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <EmojiReaction {...args} />
    </ThemeProvider>
  ),
};
