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
      @media (max-width: 383px) {
        min-height: 100px;
      }
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
      @media (max-width: 383px) {
        font-size: 18px;
      }
    `,
    quoteContainer: css`
      max-height: 300px;
      overflow: scroll;
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
      gap: 0.1rem;
      border-radius: 0 0 ${theme.radius} ${theme.radius};
      @media (max-width: 383px) {
        display: grid;
        grid-template-columns: repeat(5, 0.2fr);
      }
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
      margin-right: 5px;
      margin-left: 5px;
    `,

    oppositeDot: css`
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: ${theme.colors.background};
      margin: auto;
      margin-right: 5px;
      margin-left: 5px;
    `,

    controller: css`
      display: flex;
      width: 100%;
    `,

    leftSection: css`
      display: flex;
      align-items: left;
    `,

    record: css`
      display: flex;
    `,

    timer: css`
      margin: auto;
    `,

    spacer: css`
      flex-grow: 1;
    `,

    rightSection: css`
      display: flex;
      align-items: right;
      margin-top: 0.3rem;
    `,
    modal: {
      '@media(max-width: 768px)': {
        height: '100%',
        width: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
      },
    },
  };

  return styles;
};

export const getInsertLinkModalStyles = (theme) => {
  const styles = {
    inputWithFormattingBox: css`
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
      margin: 0.5rem 1rem;
      &.focused {
        border: ${`1.5px solid ${theme.colors.ring}`};
      }
    `,
    modalHeader: css`
      padding: 0 0.5rem;
    `,
    modalContent: css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
    `,
    modalFooter: css`
      padding: 0.75rem 1rem;
    `,
  };

  return styles;
};
