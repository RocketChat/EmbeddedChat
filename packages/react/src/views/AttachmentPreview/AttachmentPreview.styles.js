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
      width: 95.5%;
    `,

    modalContent: css`
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 350px;
    `,
  };

  return styles;
};

export default getAttachmentPreviewStyles;
