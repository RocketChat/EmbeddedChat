import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';
import { darken } from '../../lib/color';

export const ChatInputStyles = {
  iconCursor: css`
    cursor: pointer;
  `,

  textInput: css`
    resize: none;
    border: none;
    outline: none;
    font-size: 14px;

    &:focus {
      border: none;
      outline: none;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &::placeholder {
      padding-left: 5px;
    }
  `,
};

export const useChatInputFormattingToolbarStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const chatFormat = css`
    bottom: 0;
    align-items: center;
    background-color: ${mode === 'light'
      ? darken(colors.background, 0.03)
      : colors.secondary};
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 0.375rem;
    border-radius: ${theme.schemes.radius};
  `;

  return { chatFormat };
};

const commonRecorderStyles = {
  dot: css`
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: red;
    margin: auto;
    margin-right: 8px;
  `,

  container: css`
    display: flex;
  `,

  timer: css`
    margin: auto;
  `,

  record: css`
    display: flex;
    margin: auto;
  `,
};

export const AudioMessageRecorderStyles = { ...commonRecorderStyles };
export const VideoMessageRecorderStyles = { ...commonRecorderStyles };
