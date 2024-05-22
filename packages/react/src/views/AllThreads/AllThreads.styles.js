import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';
import { lighten, darken, alpha } from '../../lib/color';

const useAllThreadStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const threadListContainer = (containsThreads, filteredThreads) => {
    const centerAlign = !containsThreads || filteredThreads.length === 0;
    return css`
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      justify-content: ${centerAlign ? 'center' : 'initial'};
      align-items: ${centerAlign ? 'center' : 'initial'};
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

  const threadMessageContainer = css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-top: 0.5rem;
    -webkit-padding-before: 0.5rem;
    padding-block-start: 0.5rem;
    padding-bottom: 0.25rem;
    -webkit-padding-after: 0.25rem;
    padding-block-end: 0.25rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-inline: 1.25rem;
    cursor: pointer;

    &:hover {
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.03)
        : lighten(colors.background, 1)};
    }
  `;
  return { threadListContainer, centeredColumnStyles, threadMessageContainer };
};

export default useAllThreadStyles;
