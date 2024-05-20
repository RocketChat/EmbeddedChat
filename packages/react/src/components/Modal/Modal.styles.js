import { css, useTheme } from '@emotion/react';
import { useUserStore } from '../../store';

export const useModalstyles = () => {
  const theme = useTheme();
  const dark = useUserStore((state) => state.dark);
  const mode = dark ? 'dark' : 'light';

  const main = css`
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
    color: ${theme.schemes[mode].foreground};
    background: ${theme.schemes[mode].background};
    border-radius: 0.5rem;
  `;
  return { main };
};

export const ModalContentStyles = () => css`
  position: relative;
  overflow-y: auto !important;
`;

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
