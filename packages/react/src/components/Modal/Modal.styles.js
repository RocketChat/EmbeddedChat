import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const useModalstyles = () => {
  const { colors } = useCustomTheme();
  const main = css`
    position: absolute;
    display: flex;
    display: -ms-flexbox;
    flex-direction: column;
    align-content: stretch;
    justify-content: strech;
    max-height: 100%;
    width: 100%;
    max-width: 600px;
    padding: 0.5rem;
    color: ${colors.foreground};
    background: ${colors.background};
    border-radius: 0.5rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;
  return { main };
};

export const ModalContentStyles = {
  content: css`
    position: relative;
    overflow-y: auto !important;
  `,
};

export const useModalBackdropStyles = () => {
  const { theme } = useCustomTheme();

  const modalBackdrop = css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: ${theme.zIndex.modal};
    background: #333333b3;
    width: 100%;
    height: 100%;
  `;
  return { modalBackdrop };
};

export const ModalFooterStyles = {
  modalFooter: () => css`
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
  `,
};
