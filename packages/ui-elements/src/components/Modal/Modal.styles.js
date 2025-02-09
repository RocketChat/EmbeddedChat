import { css } from '@emotion/react';
import { alpha } from '../../lib/color';

export const getModalstyles = (theme) => {
  const styles = {
    main: css`
      position: absolute;
      display: flex;
      display: -ms-flexbox;
      flex-direction: column;
      align-content: stretch;
      justify-content: strech;
      max-height: 90%;
      width: 100%;
      max-width: 600px;
      padding: 0.5rem;
      color: ${theme.colors.foreground};
      background: ${theme.colors.background};
      border-radius: ${theme.radius};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      @media (max-width: 320px) {
        width: 90%;
        padding: 0.3rem;
        border-radius: 10px;
      }
      @media (min-width: 321px) and (max-width: 390px) {
        width: 85%;
        border-radius: 10px;
      }
      @media (min-width: 391px) and (max-width: 480px) {
        width: 70%;
        border-radius: 15px;
      }
      @media (min-width: 481px) and (max-width: 600px) {
        width: 60%;
        border-radius: 10px;
      }
      @media (min-width: 601px) and (max-width: 768px) {
        width: 65%;
        border-radius: 12px;
      }
    `,
  };

  return styles;
};

export const ModalContentStyles = {
  content: css`
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    @media (max-width: 320px) {
      font-size: 1rem;
    }
  `,
};

export const getModalBackdropStyles = (theme) => {
  const styles = {
    modalBackdrop: css`
      position: absolute;
      top: 0;
      right: 0;
      z-index: ${theme.zIndex?.modal || 1500};
      background: ${alpha(theme.commonColors.black, 0.5)};
      width: 100%;
      height: 100%;
    `,
  };

  return styles;
};

export const ModalFooterStyles = {
  modalFooter: css`
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
    @media (max-width: 420px) {
      padding: 0.5rem;
      flex-direction: column;
      gap: 0.5rem;
    }
    button {
      margin-left: 0.5rem;
      @media (max-width: 420px) {
        margin-left: 0;
        width: 100%;
        font-weight: 1.2rem;
      }
    }
  `,
};

export const ModalHeaderStyles = {
  modalHeader: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    icon {
      @media (max-width: 320px) {
        size: 1rem;
      }
      @media (min-width: 321px) and (max-width: 390px) {
        font-size: 1.3rem;
      }
      @media (min-width: 391px) and (max-width: 480px) {
        font-size: 1.1rem;
      }
      @media (min-width: 481px) and (max-width: 600px) {
        font-size: 1.2rem;
      }
    }
  `,
};

export const ModalTitleStyles = {
  modalTitle: css`
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
    @media (max-width: 320px) {
      font-size: 1.2rem;
      margin: 0.15rem !important;
    }
    @media (min-width: 321px) and (max-width: 390px) {
      font-size: 1.2rem;
    }
    @media (min-width: 391px) and (max-width: 480px) {
      font-size: 1.3rem;
    }
    @media (min-width: 481px) and (max-width: 600px) {
      font-size: 1.3rem;
    }
    @media (min-width: 601px) and (max-width: 768px) {
      font-size: 1.2rem;
    }
  `,
};

export const ModalThumbStyles = {
  modalThumb: css`
    display: flex;
    align-items: center;
  `,
};
