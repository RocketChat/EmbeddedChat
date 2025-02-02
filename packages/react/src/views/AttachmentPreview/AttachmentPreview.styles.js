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

    modal: {
      '@media(max-width: 480px)': {
        maxWidth: '70%',
        maxHeight: '60%',
      },
      '@media(max-width: 600px)': {
        maxWidth: '60%',
      },
      '@media(max-width: 768px)': {
        maxWidth: '65%',
      },
    },

    modalTitle: css`
      @media (max-width: 320px) {
        font-size: 20px;
      }
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
