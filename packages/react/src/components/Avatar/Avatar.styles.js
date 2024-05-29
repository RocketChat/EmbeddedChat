import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const useAvatarStyles = () => {
  const { theme, colors } = useCustomTheme();
  const imageAvatar = (size) => css`
    border-radius: ${theme.schemes.radius};
    height: ${size};
    width: ${size};
  `;

  const fallbackContainer = (size) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.primary};
    color: ${colors.primaryForeground};
    border-radius: ${theme.schemes.radius};
    height: ${size};
    width: ${size};
  `;

  return { imageAvatar, fallbackContainer };
};

export const avatarContainerStyles = {
  avatarContainer: css`
    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
  `,
};
