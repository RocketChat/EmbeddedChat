import { css } from '@emotion/react';
import { darken, lighten } from '@embeddedchat/ui-elements';

export const getChatInputStyles = ({ theme }) => {
  const styles = {
    inputWithFormattingBox: css`
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
      margin: 0.5rem 2rem 1rem 2rem;
      &.focused {
        border: ${`1.5px solid ${theme.colors.ring}`};
      }
    `,

    inputBox: css`
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 0.5rem;
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

export const getChatInputToolbarStyles = ({ theme, mode }) => {
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

export const getFormatterStyles = ({ theme }) => {
  const styles = {
    toolboxContainer: css`
      display: flex;
      position: absolute;
      bottom: 100%;
      left: auto;
      z-index: 1101;
    `,

    toolbox: css`
      display: flex;
      background-color: ${theme.colors.background};
      box-shadow: 0 0 2px ${theme.colors.foreground};
      gap: 0.25rem;
      padding: 0.25rem;
      border-radius: ${theme.radius};
    `,
  };

  return styles;
};
