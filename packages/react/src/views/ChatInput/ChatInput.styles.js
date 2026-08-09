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
      min-height: 2.75rem;
      padding: 0.7rem 0.25rem;

      &[contenteditable='true'] {
        cursor: text;
      }

      &[contenteditable='true']:empty::before {
        content: attr(data-placeholder);
        color: ${theme.colors.mutedForeground};
        pointer-events: none;
      }

      &[contenteditable='false'] {
        cursor: not-allowed;
        opacity: 0.7;
      }

      .ec-ai-pending {
        margin: 0 1px;
        white-space: pre-wrap;
        border-radius: 3px;
        background: color-mix(
          in srgb,
          ${theme.colors.primary} 16%,
          transparent
        );
        animation: ec-ai-pulse 1.25s ease-in-out infinite;
      }

      .ec-ai-suggestion {
        position: relative;
        margin: 0 1px;
        white-space: pre-wrap;
        border-bottom: 1px dashed ${theme.colors.primary};
        background: color-mix(
          in srgb,
          ${theme.colors.primary} 10%,
          transparent
        );
      }

      .ec-ai-suggestion code,
      .ec-ai-pending code {
        padding: 0.05rem 0.22rem;
        border-radius: 0.2rem;
        background: color-mix(
          in srgb,
          ${theme.colors.foreground} 10%,
          transparent
        );
        font-family: monospace;
      }

      .ec-ai-suggestion a,
      .ec-ai-pending a {
        color: ${theme.colors.primary};
        text-decoration: underline;
      }

      .ec-ai-suggestion-controls {
        display: none;
        position: static;
        margin-left: 0.3rem;
        vertical-align: middle;
        gap: 0.15rem;
        padding: 0.15rem;
        border: 1px solid ${theme.colors.border};
        border-radius: 0.4rem;
        background: ${theme.colors.card};
        box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.12);
      }

      .ec-ai-suggestion:hover .ec-ai-suggestion-controls,
      .ec-ai-suggestion:focus-within .ec-ai-suggestion-controls {
        display: inline-flex;
      }

      .ec-ai-suggestion-controls button {
        width: 1.1rem;
        height: 1.1rem;
        padding: 0;
        border: 0;
        border-radius: 50%;
        cursor: pointer;
      }

      .ec-ai-suggestion-accept {
        background: ${theme.colors.primary};
      }

      .ec-ai-suggestion-accept::before {
        color: ${theme.colors.primaryForeground};
        content: '✓';
        font-size: 0.7rem;
      }

      .ec-ai-suggestion-reject {
        background: ${theme.colors.muted};
      }

      .ec-ai-suggestion-reject::before {
        color: ${theme.colors.foreground};
        content: '×';
        font-size: 0.8rem;
      }

      @keyframes ec-ai-pulse {
        0%,
        100% {
          opacity: 0.55;
        }
        50% {
          opacity: 1;
        }
      }

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

    aiSuggestionsContainer: css`
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      padding: 0.35rem 2rem 0;
    `,

    aiSuggestionChip: css`
      font-size: 0.8rem;
      padding: 0.28rem 0.6rem;
      border-radius: 1rem;
      border: 1px solid ${theme.colors.border};
      background: ${theme.colors.card};
      color: ${theme.colors.foreground};
      cursor: pointer;
      &:hover,
      &:focus-visible {
        border-color: ${theme.colors.primary};
        outline: none;
      }
    `,

    actionButtonsContainer: css`
      padding: 0.25rem;
    `,

    longMessageModal: css`
      padding: 1em;
    `,

    longMessageModalContent: css`
      margin: 1em;
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
      width: 100%;
      display: inline-flex;
    `,

    timer: css`
      margin: auto;
    `,

    spacer: css`
      flex-grow: 1;
    `,

    record: css`
      display: flex;
      margin: auto;
    `,

    leftSection: css`
      display: flex;
      align-items: left;
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
