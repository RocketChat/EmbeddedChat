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

export const getTimestampStyles = (theme, mode) => {
  const styles = {
    timestampModal: css`
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1300;

      // Not hardcoding the color; this value will be the same for all themes.
      background-color: rgba(0, 0, 0, 0.2);
    `,
    timestampModalContent: css`
      background-color: ${theme.colors.card};
      color: ${theme.colors.cardForeground};
      border-radius: 10px;
      padding: 20px;
      max-width: 400px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    `,
    modalHeader: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      border-bottom: 1px solid ${theme.colors.border};
      padding-bottom: 10px;
    `,
    timestampPreview: css`
      margin-bottom: 20px;
      padding: 10px;
      background-color: ${mode === 'light'
        ? theme.commonColors.white
        : theme.commonColors.black};
      border: 1px solid ${theme.colors.border};
      border-radius: 5px;
    `,
    previewText: css`
      font-weight: bold;
    `,
    previewCode: css`
      font-family: monospace;
      color: ${theme.colors.info};
      word-wrap: break-word;
    `,
    timestampInputs: css`
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    `,
    dateInput: css`
      width: 48%;
    `,
    timeInput: css`
      width: 48%;
    `,
    inputLabel: css`
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: bold;
      color: ${theme.colors.foreground};
    `,
    inputField: css`
      width: 100%;
      padding: 8px;
      border-radius: 5px;
      border: 1px solid ${theme.colors.input};
      font-size: 14px;
      background-color: ${lighten(theme.colors.background, 1)};
      color: ${theme.colors.foreground};
    `,
    formatSelection: css`
      margin-bottom: 20px;
    `,
    formatOptions: css`
      max-height: 200px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    `,
    formatOption: css`
      width: calc(50% - 5px);
      display: flex;
      align-items: flex-start;
      padding: 10px;
      border: 1px solid ${theme.colors.border};
      border-radius: 5px;
      margin-bottom: 10px;
      cursor: pointer;

      &:nth-last-child(-n + 3) {
        width: 100%;
      }
    `,
    formatOptionSelected: css`
      background-color: ${theme.colors.accent};
      border-color: ${theme.colors.primary};
    `,
    formatRadio: css`
      margin-right: 10px;
    `,
    formatDetails: css`
      flex: 1;
      cursor: pointer;
    `,
    formatLabel: css`
      font-size: 17px;
      font-weight: bold;
      color: ${theme.colors.foreground};
    `,
    formatDescription: css`
      font-size: 14px;
      color: ${theme.colors.mutedForeground};
    `,
    formatExample: css`
      font-size: 12px;
      color: ${theme.colors.accentForeground};
    `,
    modalFooter: css`
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    `,
  };

  return styles;
};
