import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useUserInformationStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const userSidebar = css`
    padding: 0 1rem 1rem;
    margin: 0 auto;
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
    border-radius: 2px;
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
