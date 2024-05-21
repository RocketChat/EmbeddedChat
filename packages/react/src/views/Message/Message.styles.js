import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

export const useMessageStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const message = css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-top: 0.5rem;
    -webkit-padding-before: 0.5rem;
    padding-block-start: 0.5rem;
    padding-bottom: 0.25rem;
    -webkit-padding-after: 0.25rem;
    padding-block-end: 0.25rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-inline: 1.25rem;
    color: ${colors.foreground};
  `;
  const messageEditing = css`
    background-color: #fff8e0;
    &:hover {
      background-color: #fff8e0;
    }
  `;

  const pendingMessageBody = css`
    opacity: 0.4 !important;
    white-space: pre-line;
  `;

  return { message, messageEditing, pendingMessageBody };
};

export const MessageAvatarContainerStyles = {
  container: css`
    margin: 3px;
    width: 2.25em;
    max-height: 2.25em;
    display: flex;
    justify-content: flex-end;
  `,
};

export const MessageBodyStyles = {
  messageBody: css`
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
    margin-block: 0.125rem;
  `,
};

export const MessageContainerStyles = {
  messageContainer: css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 1px;
    margin-top: -0.125rem;
    margin-bottom: -0.125rem;
    margin-block: -0.125rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    margin-inline: 0.25rem;
  `,
};

export const useMessageDividerStyles = () => {
  const theme = useTheme();

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
    margin-bottom: 0.5rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-inline: 1.25rem;
  `;

  const bar = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    height: 1px;
  `;

  const dividerwrapper = css`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    margin-block: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-inline: 0.5rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  `;

  return { divider, bar, dividerwrapper };
};

export const MessageHeaderStyles = {
  header: css`
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 1px;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-block: 0.125rem;
    gap: 0.125rem;
    align-items: center;
  `,

  headerName: css`
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `,

  userRole: css`
    letter-spacing: 0rem;
    font-size: 0.75rem;
    padding: 0 0.25rem;
    margin: 0 0.1rem;
    border-radius: 2px;
    font-weight: 700;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  userName: css`
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  `,

  headerTimestamp: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0rem;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
    flex-shrink: 0;
  `,
};

export const MessageMetricsStyles = {
  metrics: css`
    display: flex;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    margin-inline: -0.25rem;
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

export const MessageReactionsStyles = {
  container: css`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin: -0.125rem;
  `,

  reaction: css`
    letter-spacing: 0rem;
    font-size: 0.85rem;
    font-weight: 400;
    line-height: 1rem;
    display: inline-flex;
    gap: 0.125rem;
    align-items: center;
    margin: 0.125rem;
    padding: 0.125rem;
    cursor: pointer;
    border-radius: 0.25rem;
    img.joypixels {
      height: 1.25em;
      width: 1.25em;
    }
    p {
      margin: 0;
    }
  `,

  reactionMine: css`
    border-width: 1px;
  `,
};

export const useMessageToolboxStyles = () => {
  const theme = useTheme();
  const container = css`
    display: none;
    .ec-message:hover & {
      display: flex;
      position: absolute;
      bottom: 100%;
      z-index: ${theme.zIndex.body};
      right: 2rem;
    }
  `;

  const toolbox = css`
    display: flex;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    margin-inline: -0.25rem;
    margin-top: 0.125rem;
    font-size: 1.25rem !important;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
  `;

  return { container, toolbox };
};
