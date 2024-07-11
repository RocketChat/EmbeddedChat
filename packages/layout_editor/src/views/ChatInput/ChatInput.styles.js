import { css } from "@emotion/react";
import { darken, useTheme } from "@embeddedchat/ui-elements";

export const useChatInputStyles = () => {
  const { theme, colors } = useTheme();

  const inputWithFormattingBox = css`
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    margin: 0.5rem 2rem 1rem 2rem;
    &.focused {
      border: ${`1.5px solid ${colors.ring}`};
    }
  `;

  const inputBox = css`
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 0.5rem;
  `;

  const textInput = css`
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
  `;

  return {
    inputWithFormattingBox,
    inputBox,
    textInput,
  };
};

export const useChatInputFormattingToolbarStyles = () => {
  const { theme, mode, colors } = useTheme();

  const chatFormat = css`
    bottom: 0;
    padding: 0.2rem;
    align-items: center;
    background-color: ${mode === "light"
      ? darken(colors.background, 0.03)
      : colors.secondary};
    display: flex;
    position: relative;
    flex-direction: row;
    gap: 0.375rem;
    border-radius: 0 0 ${theme.schemes.radius} ${theme.schemes.radius};
  `;

  return { chatFormat };
};
