import { css } from '@emotion/react';

const getAttachmentPreviewStyles = () => {
  const styles = {
    inputContainer: css`
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      margin: 20px 0 0 0 !important;
    `,

    input: css`
      width: 100%;
    `,

    modalContent: css`
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 350px;
    `,

    fileDescription: css`
      width: 100%;
      position: relative;
      z-index: 1300;
    `,

    mentionListContainer: css`
      position: absolute;
      top: -100px;
      width: 100%;
      max-height: 100px;
      overflow-y: auto;
      background: white;
      z-index: 1400;
    `,
  };

  return styles;
};

export default getAttachmentPreviewStyles;
