import { css } from '@emotion/react';
import { alpha } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useAttachmentPreviewStyles = () => {
  const { colors } = useCustomTheme();
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
    ::-webkit-scrollbar {
      width: 4px;
      height: 7.7px;
    }
    ::-webkit-scrollbar-thumb {
      background: ${alpha(colors.primary, 0.5)};
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.primary};
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  `;

  return { inputContainer, input, modalContent };
};

export default useAttachmentPreviewStyles;
