import { css } from '@emotion/react';

import { alpha } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useUserInformationStyles = () => {
  const { colors } = useCustomTheme();
  const userSidebar = css`
    padding: 0 1rem 1rem;
    margin: 0 auto;
    overflow: auto;
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
