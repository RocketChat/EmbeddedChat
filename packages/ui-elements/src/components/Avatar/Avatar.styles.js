import { css } from '@emotion/react';

export const getAvatarStyles = (theme) => {
  const styles = {
    imageAvatar: (size) => css`
      border-radius: ${theme.radius};
      height: ${size};
      width: ${size};
    `,

    fallbackContainer: (size) => css`
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${theme.colors.primary};
      color: ${theme.colors.primaryForeground};
      border-radius: ${theme.radius};
      height: ${size};
      width: ${size};
    `,
  };

  return styles;
};

export const avatarContainerStyles = {
  avatarContainer: css`
    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
  `,
};
