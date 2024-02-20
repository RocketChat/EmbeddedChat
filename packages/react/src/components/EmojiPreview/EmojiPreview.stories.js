import { ThemeProvider } from '@emotion/react';
import { EmojiPreview } from '.';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Components/EmojiPreview',
  component: EmojiPreview,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default = {
  args: {
    messageRef: {
      current: {
        value: ':smi',
      },
    },
    emojiListLengthRef: {
      current: 0,
    },
    currentEmojiIndex: 0,
    setCurrentEmojiIndex: () => {},
  },
  render: (args) => (
    <ThemeProvider theme={DefaultTheme}>
      <EmojiPreview {...args} />
    </ThemeProvider>
  ),
};
