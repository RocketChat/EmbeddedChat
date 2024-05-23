import { css } from '@emotion/react';
import { alpha } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const usePinnedMessageStyles = () => {
  const { colors } = useCustomTheme();
  const pinnedListContainer = (messageList) => {
    const centerAlign = messageList.length === 0;
    return css`
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      justify-content: ${centerAlign ? 'center' : 'initial'};
      align-items: ${centerAlign ? 'center' : 'initial'};
      overflow-x: hidden;
      max-width: 100%;

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
  };

  const centeredColumnStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return { pinnedListContainer, centeredColumnStyles };
};

export default usePinnedMessageStyles;
