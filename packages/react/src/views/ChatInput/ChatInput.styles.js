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
      @media (max-width: 500px) {
        margin: 0;
        width: 100%;
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

    modal: {
      '@media(max-width: 602px)': {
        maxWidth: '80%',
      },
    },

    modalTitle: css`
      @media (max-width: 602px) {
        font-size: 20px;
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
      gap: 0.15rem;
      display: inline-flex;
    `,

    timer: css`
      margin: auto;
    `,
    record: css`
      display: flex;
      margin: auto;
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
    modal: {
      '@media(max-width: 602px)': {
        maxHeight: '70%',
        maxWidth: '80%',
      },
      '@media(max-width: 870px)': {
        maxWidth: '70%',
      },
    },

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
