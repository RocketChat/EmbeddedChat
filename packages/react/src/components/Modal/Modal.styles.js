import { css } from '@emotion/react';

export const Modalstyles = {
  modal: (theme) => css`
    background: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    position: static;
    width: 100%;
    max-width: 600px;
    padding: 0.5rem;
    background: ${theme?.palette?.background?.modal || '#fff'};
    border-radius: 0.5rem;
  `,
};

export const ModalBackdropStyles = {
  modalBackdrop: css`
    position: fixed;
    z-index: 10000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #333333b3;
    width: 100%;
    height: 100%;
  `,
};

export const ModalContentStyles = {
  modalContent: (theme) => css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    position: relative;
    overflow-y: auto !important;
  `,
};

export const ModalFooterStyles = {
  modalFooter: (theme) => css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    -webkit-box-pack: end !important;
    -ms-flex-pack: end !important;
    -webkit-justify-content: end !important;
    justify-content: end !important;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    gap: 0.5rem;
  `,
};

export const ModalHeaderStyles = {
  modalHeader: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  `,
};

export const ModalTitleStyles = {
  modalTitle: (theme) => css`
    color: ${theme?.palette?.text?.primary || '#2f343d'};
    margin: 0.25rem !important;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
  `,
};
