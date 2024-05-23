import { css } from '@emotion/react';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const useStarredMessageStyles = () => {
  const { scrollStyles } = useGlobalStyles();
  const starredListContainer = (messageList) => {
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
      ${scrollStyles};
    `;
  };

  const centeredColumnStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return { starredListContainer, centeredColumnStyles };
};

export default useStarredMessageStyles;
