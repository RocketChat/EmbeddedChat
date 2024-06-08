import { css } from '@emotion/react';
import { lighten, darken } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const useMessageStyles = () => {
  const { mode, colors } = useCustomTheme();

  const main = css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
    padding-left: 2.25rem;
    padding-right: 2.25rem;
    color: ${colors.foreground};

    &:hover {
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.03)
        : lighten(colors.background, 1)};
    }
  `;
  const messageEditing = css`
    background-color: ${colors.secondary};
    &:hover {
      background-color: ${colors.secondary};
    }
  `;

  const pendingMessageBody = css`
    opacity: 0.4 !important;
    white-space: pre-line;
  `;

  return { main, messageEditing, pendingMessageBody };
};

export const useMessageAvatarContainerStyles = () => {
  const { colors } = useCustomTheme();

  const container = css`
    margin: 3px;
    width: 2.25em;
    max-height: 2.25em;
    display: flex;
    justify-content: flex-end;
    color: ${colors.primary};
  `;

  return { container };
};

export const MessageBodyStyles = {
  messageBody: css`
    position: relative;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    flex-shrink: 1;
    transition: opacity 0.3s linear;
    word-break: break-word;
    opacity: 1;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
  `,
};

export const useMessageDividerStyles = () => {
  const { theme, colors } = useCustomTheme();

  const divider = css`
    letter-spacing: 0rem;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1rem;
    position: relative;
    display: flex;
    z-index: ${theme.zIndex.divider};
    align-items: center;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  `;

  const dividerContent = css`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    background-color: ${colors.secondary};
    color: ${colors.secondaryForeground};
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${theme.schemes.radius};
  `;

  const bar = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    height: 1px;
    background-color: ${colors.secondary};
  `;

  return { divider, bar, dividerContent };
};

export const useMessageHeaderStyles = () => {
  const { theme, colors } = useCustomTheme();

  const header = css`
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 1px;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    gap: 0.125rem;
    align-items: center;
  `;

  const headerName = css`
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `;

  const userRole = css`
    letter-spacing: 0rem;
    font-size: 0.75rem;
    padding: 0 0.25rem;
    margin: 0 0.1rem;
    border-radius: ${theme.schemes.radius};
    font-weight: 700;
    line-height: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: ${colors.secondary};
  `;

  const userName = css`
    color: ${colors.accentForeground};
    letter-spacing: 0rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `;

  const headerTimestamp = css`
    color: ${colors.accentForeground};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0rem;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    flex-shrink: 0;
    margin-left: 0.25rem;
  `;

  return { header, headerName, userRole, userName, headerTimestamp };
};

export const MessageMetricsStyles = {
  metrics: css`
    display: flex;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    margin-top: 0.5rem;
  `,

  metricsItem: (isFirstMessage = false) => css`
    letter-spacing: 0rem;
    font-size: 0.625rem;
    font-weight: 700;
    line-height: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: ${isFirstMessage ? '0.5rem' : '0.25rem'};
  `,

  metricsItemLabel: css`
    margin: 0.25rem;
    margin-inline-start: 0.25rem;
    white-space: nowrap;
  `,
};

export const useMessageReactionsStyles = () => {
  const { colors } = useCustomTheme();
  const container = css`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  `;

  const reaction = css`
    letter-spacing: 0rem;
    font-size: 0.6rem;
    display: inline-flex;
    gap: 0.125rem;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    margin: 0.125rem;
    cursor: pointer;
    img.joypixels {
      height: 0.75em;
      width: 0.75em;
    }
    p {
      margin: 0;
    }
    border: 1px solid ${colors.border};
    border-radius: 0.2rem;
  `;

  const reactionMine = css`
    background: ${colors.secondary};
  `;

  return { container, reaction, reactionMine };
};

export const useMessageToolboxStyles = () => {
  const { theme, colors } = useCustomTheme();

  const toolboxContainer = css`
    display: none;
    .ec-message:hover & {
      display: flex;
      position: absolute;
      bottom: 100%;
      z-index: ${theme.zIndex.body + 1};
      right: 2rem;
    }
  `;

  const toolbox = css`
    display: flex;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    margin-top: 0.125rem;
    background-color: ${colors.background};
    box-shadow: 0 0 2px ${colors.foreground};
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: ${theme.schemes.radius};
  `;

  const emojiPickerStyles = css`
    position: absolute;
    top: 0.5rem;
    right: 1.5rem;
  `;

  return {
    toolboxContainer,
    toolbox,
    emojiPickerStyles,
  };
};

export const useMessageBodyContainerStyles = () => {
  const bodyContainer = css`
    margin-left: 5px;
    position: relative;
    width: 100%;
  `;

  return { bodyContainer };
};
