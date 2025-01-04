import { css } from '@emotion/react';
import { darken, lighten } from '@embeddedchat/ui-elements';

export const getChatInputStyles = (theme) => {
  const styles = {
    inputWithFormattingBox: css`
      width: 100%;
      margin-bottom: 5px;
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.radius};
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
      min-width: 0;
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
      @media (min-width: 383px) {
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
    `,
    popOverStyles: css`
      position: absolute;
      bottom: 3rem;
      left: 0;
      width: 100%;
      background: ${theme.colors.background};
      box-shadow: 0 -8px 10px ${mode === 'light' ? darken(theme.colors.background, 0.1) : lighten(theme.colors.background, 1)};
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      z-index: 1300;
    `,
    popOverItemStyles: css`
      display: flex;
      gap: 0.5rem;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
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
