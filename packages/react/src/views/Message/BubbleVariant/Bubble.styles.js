import { css } from '@emotion/react';
import { alpha } from '@embeddedchat/ui-elements';

export const getBubbleStyles = (theme) => {
  const styles = {
    name: 'bubble',
    messageParent: css`
      display: flex;
      gap: 0.25rem;
      flex-direction: row;
      align-items: flex-start;
      padding: 0 2.25rem 0.25rem 2.25rem;
      a {
        color: ${theme.colors.primaryForeground};
      }
    `,

    messageBodyContainer: css`
      display: flex;
      flex: 1;
      align-items: flex-start;
      flex-direction: column;
    `,

    messageBody: css`
      position: relative;
      letter-spacing: 0rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      transition: opacity 0.3s linear;
      word-break: break-word;
      opacity: 1;
      margin-top: 0.125rem;
      margin-bottom: 0.125rem;
      width: fit-content;
      max-width: 80%;
      padding: 0.5rem 0.75rem;
      border-radius: ${theme.radius} ${theme.radius} ${theme.radius} 0.2rem;
      background: ${theme.colors.primary};
      color: ${theme.colors.primaryForeground};
      &:hover {
        background: ${alpha(theme.colors.primary, 0.8)};
      }
    `,

    attachmentBody: css`
      position: relative;
      width: fit-content;
      max-width: 80%;
      border-radius: ${theme.radius} ${theme.radius} ${theme.radius} 0.2rem;
    `,

    sequential: css`
      border-radius: 0.2rem ${theme.radius} ${theme.radius} 0.2rem;
    `,
    lastSequential: css`
      border-radius: 0.2rem ${theme.radius} ${theme.radius};
    `,

    metricsContainer: css`
      display: flex;
      margin: 0.25rem;
    `,

    threadReplyButton: css`
      background-color: ${theme.colors.accent};
      color: ${theme.colors.accentForeground};
      border-radius: 0.2rem;
    `,

    arcIcon: css`
      transform: none;
    `,

    toolboxContainer: css`
      display: none;
      .ec-message-body:hover & {
        display: flex;
        position: absolute;
        bottom: calc(100% - 20px);
        left: calc(100% - 20px);
        z-index: 1101;
      }
    `,

    videoAttachmentContainer: css`
      border: 1px solid ${theme.colors.border};
      border-radius: inherit;
    `,
    imageAttachmentContainer: css`
      border: 1px solid ${theme.colors.border};
      border-radius: inherit;
      overflow: hidden;
    `,
    pinnedContainer: css`
      max-width: 80%;
    `,

    quoteContainer: css`
      background-color: ${theme.colors.background};
      color: ${theme.colors.foreground};
      flex: 1;
      border-bottom-right-radius: inherit;
      border-bottom-left-radius: inherit;
      border: 2px solid ${theme.colors.border};
      margin: 0.2rem -0.75rem -0.5rem;
    `,

    textUserInfo: css`
      align-self: flex-start;
    `,

    attachmentMetaContainer: css`
      padding: 2.5% 2.5% 0;
    `,

    emojiPickerStyles: css`
      position: absolute;
      bottom: 100%;
      left: calc(100% + 5px);
    `,
  };

  return styles;
};

export const getBubbleStylesMe = (theme) => {
  const styles = {
    messageParentMe: css`
      flex-direction: row-reverse;
    `,

    messageBodyContainerMe: css`
      align-items: flex-end;
    `,

    messageBodyMe: css`
      background: ${theme.colors.secondary};
      color: ${theme.colors.secondaryForeground};
      border-radius: ${theme.radius} ${theme.radius} 0.2rem ${theme.radius};
      &:hover {
        background: ${alpha(theme.colors.secondary, 0.8)};
      }
    `,

    attachmentBodyMe: css`
      border-radius: ${theme.radius} ${theme.radius} 0.2rem ${theme.radius};
    `,

    lastSequentialMe: css`
      border-radius: ${theme.radius} 0.2rem ${theme.radius} ${theme.radius};
    `,
    sequentialMe: css`
      border-radius: ${theme.radius} 0.2rem 0.2rem ${theme.radius};
    `,

    metricsContainerMe: css`
      flex-direction: row-reverse;
    `,

    arcIconMe: css`
      transform: scaleX(-1);
    `,

    toolboxContainerMe: css`
      .ec-message-body:hover & {
        left: auto;
        right: calc(100% - 20px);
      }
    `,

    pinnedContainerMe: css`
      border-inline-start: none;
      border-inline-end: 3px solid ${theme.colors.border};
    `,

    textUserInfoMe: css`
      align-self: flex-end;
    `,

    emojiPickerStylesMe: css`
      left: auto;
      right: calc(100% + 5px);
    `,
  };

  return styles;
};
