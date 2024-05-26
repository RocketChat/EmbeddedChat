import { css } from '@emotion/react';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const useAttachmentPreviewStyles = () => {
  const { scrollStyles } = useGlobalStyles();
  const inputContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    margin: 20px 0 0 0 !important;
  `;

  const input = css`
    width: 95.5%;
  `;

  const modalContent = css`
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 350px;
    ${scrollStyles};
  `;

  return { inputContainer, input, modalContent };
};

export default useAttachmentPreviewStyles;
