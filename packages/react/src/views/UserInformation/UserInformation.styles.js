import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { useGlobalStyles } from '../EmbeddedChat.styles';

const useUserInformationStyles = () => {
  const { theme, colors } = useCustomTheme();
  const { scrollStyles } = useGlobalStyles();
  const userSidebar = css`
    padding: 0 1rem 1rem;
    margin: 0 auto;
    overflow: auto;
    ${scrollStyles};
  `;

  const roleContainer = css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
  `;

  const userRole = css`
    letter-spacing: 0rem;
    font-size: 0.75rem;
    padding: 0 0.25rem;
    margin: 0 0.1rem;
    border-radius: ${theme.schemes.radius};
    font-weight: 700;
    line-height: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: ${colors.secondary};
  `;

  const emailContainer = css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-block: 5px;
  `;

  const centeredColumnStyles = css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return {
    userSidebar,
    roleContainer,
    userRole,
    emailContainer,
    centeredColumnStyles,
  };
};

export default useUserInformationStyles;
