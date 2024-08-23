import { css } from '@emotion/react';
import { darken, lighten } from '@embeddedchat/ui-elements';

export const getChatInputStyles = (theme) => {
  const styles = {
    inputWithFormattingBox: css`
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
      margin: 0.5rem 2rem 1rem 2rem;
      &.focused {
        border: ${`1.5px solid ${theme.colors.ring}`};
      }
    `,

    editMessage: css`
      border: 2px solid ${theme.colors.border};
    `,

    inputBox: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      padding: 0.5rem;
    `,

    iconCursor: css`
      cursor: pointer;
    `,

    textInput: css`
      flex: 1;
      word-wrap: break-word;
      white-space: pre-wrap;
      overflow: auto;
      overflow-x: hidden;
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

  return styles;
};

export const getChatInputFormattingToolbarStyles = ({ theme, mode }) => {
  const styles = {
    chatFormat: css`
      bottom: 0;
      padding: 0.2rem;
      align-items: center;
      background-color: ${mode === 'light'
        ? darken(theme.colors.background, 0.03)
        : lighten(theme.colors.background, 1)};
      display: flex;
      position: relative;
      flex-direction: row;
      gap: 0.375rem;
      border-radius: 0 0 ${theme.radius} ${theme.radius};
    `,
  };
  return styles;
};

export const getCommonRecorderStyles = (theme) => {
  const styles = {
    dot: css`
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: ${theme.colors.destructive};
      margin: auto;
      margin-right: 8px;
    `,

    controller: css`
      display: flex;
      gap: 0.15rem;
    `,

    timer: css`
      margin: auto;
    `,
    record: css`
      display: flex;
      margin: auto;
    `,
  };

  return styles;
};
