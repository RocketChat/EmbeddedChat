import { css, useTheme } from '@emotion/react';
import { alpha, lighten, darken } from '../../lib/color';
import { useThemeStore } from '../../store';

const useUserMentionsStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const message = css`
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
    &:hover {
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.03)
        : lighten(colors.background, 1)};
    }
  `;

  const userMentionsListContainer = (messageList) => {
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

  return { message, userMentionsListContainer, centeredColumnStyles };
};

export default useUserMentionsStyles;
