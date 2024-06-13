import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const useMemberListStyles = () => {
  const { theme, colors } = useCustomTheme();
  const { scrollStyles } = useGlobalStyles();
  const main = css`
    margin: 0.2rem 2rem;
    display: block;
    overflow: auto;
    max-height: 10rem;
    overflow-x: hidden;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    color: ${colors.secondaryForeground};
    ${scrollStyles};
  `;

  const listItem = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.25rem;

    &:hover {
      background-color: ${colors.secondary};
    }
  `;

  const listText = css`
    font-weight: 600;
  `;

  return { main, listItem, listText };
};

export default useMemberListStyles;
