import { css } from '@emotion/react';

export const ChatInputStyles = {
  editingMessage: css`
    background-color: #fff8e0;
    & textarea {
      background-color: inherit;
    }
  `,

  iconCursor: css`
    cursor: pointer;
  `,

  textInput: css`
    padding: 12px;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 0.875rem;
    font-family: var(
      --rcx-font-family-sans,
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Helvetica Neue',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Meiryo UI',
      Arial,
      sans-serif
    );

    &:disabled {
      cursor: not-allowed;
    }

    &::placeholder {
      padding-left: 5px;
    }
  `,
};

export const ChatInputFormattingToolbarStyles = {
  chatFormat: css`
    bottom: 0;
    align-items: center;
    background-color: #cbced1;
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 0.375rem;
  `,
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
