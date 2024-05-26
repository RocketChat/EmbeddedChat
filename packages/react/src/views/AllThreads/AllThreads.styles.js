import { css } from '@emotion/react';

import { lighten, darken } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const useAllThreadStyles = () => {
  const { mode, colors } = useCustomTheme();
  const { scrollStyles } = useGlobalStyles();

  const threadListContainer = (containsThreads, filteredThreads) => {
    const centerAlign = !containsThreads || filteredThreads.length === 0;
    return css`
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      justify-content: ${centerAlign ? 'center' : 'initial'};
      align-items: ${centerAlign ? 'center' : 'initial'};
      ${scrollStyles};
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
