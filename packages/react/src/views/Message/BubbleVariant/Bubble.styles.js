import { css } from '@emotion/react';

const bubbleStyles = (customTheme) => {
  const { theme, colors } = customTheme;

  const messageParent = css`
    display: flex;
    gap: 0.25rem;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 2.25rem 0.25rem 2.25rem;
    color: ${colors.foreground};
  `;

  const messageParentMe = css`
    flex-direction: row-reverse;
  `;

  const messageBodyContainer = css`
    display: flex;
    flex: 1;
    align-items: flex-start;
    flex-direction: column;
  `;

  const messageBodyContainerMe = css`
    align-items: flex-end;
  `;

  const messageBody = css`
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
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius}
      ${theme.schemes.radius} 0.2rem;
    background: ${colors.primary};
    color: ${colors.primaryForeground};
  `;

  const messageBodyMe = css`
    background: ${colors.secondary};
    color: ${colors.secondaryForeground};
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius} 0.2rem
      ${theme.schemes.radius};
  `;

  const attachmentBody = css`
    position: relative;
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius}
      ${theme.schemes.radius} 0.2rem;
  `;

  const attachmentBodyMe = css`
    border-radius: ${theme.schemes.radius} ${theme.schemes.radius} 0.2rem
      ${theme.schemes.radius};
  `;

  const sequential = css`
    border-radius: 0.2rem ${theme.schemes.radius} ${theme.schemes.radius} 0.2rem;
  `;
  const lastSequential = css`
    border-radius: 0.2rem ${theme.schemes.radius} ${theme.schemes.radius};
  `;

  const lastSequentialMe = css`
    border-radius: ${theme.schemes.radius} 0.2rem ${theme.schemes.radius}
      ${theme.schemes.radius};
  `;

  const sequentialMe = css`
    border-radius: ${theme.schemes.radius} 0.2rem 0.2rem ${theme.schemes.radius};
  `;

  const metricsContainer = css`
    display: flex;
    margin: 0.25rem;
  `;

  const metricsContainerMe = css`
    flex-direction: row-reverse;
  `;

  const threadReplyButton = css`
    background-color: ${colors.accent};
    color: ${colors.accentForeground};
    border-radius: 0.2rem;
  `;

  const arcIconMe = css`
    transform: scaleX(-1);
  `;

  const toolboxContainer = css`
    display: none;
    .ec-message-body:hover & {
      display: flex;
      position: absolute;
      bottom: calc(100% - 20px);
      left: calc(100% - 20px);
      z-index: ${theme.zIndex.body + 1};
    }
  `;

  const toolboxContainerMe = css`
    .ec-message-body:hover & {
      left: auto;
      right: calc(100% - 20px);
    }
  `;

  const videoAttachmentContainer = css`
    border: 1px solid ${colors.border};
    border-radius: inherit;
  `;

  const imageAttachmentContainer = css`
    border: 1px solid ${colors.border};
    border-radius: inherit;
    overflow: hidden;
  `;

  return {
    messageParent,
    messageParentMe,
    messageBody,
    messageBodyMe,
    messageBodyContainer,
    lastSequentialMe,
    sequentialMe,
    sequential,
    lastSequential,
    messageBodyContainerMe,
    attachmentBody,
    attachmentBodyMe,
    metricsContainer,
    metricsContainerMe,
    arcIconMe,
    threadReplyButton,
    toolboxContainer,
    toolboxContainerMe,
    videoAttachmentContainer,
    imageAttachmentContainer,
  };
};

export default bubbleStyles;
