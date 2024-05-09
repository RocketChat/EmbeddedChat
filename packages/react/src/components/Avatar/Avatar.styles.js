import { css } from '@emotion/react';

export const avatarStyles = {
  imageAvatar: (size) => css`
    border-radius: 0.25rem;
    height: ${size};
    width: ${size};
  `,

  fallbackContainer: (size) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #007fff;
    color: #ffffff;
    border-radius: 0.25rem;
    height: ${size};
    width: ${size};
  `,
};

export const avatarContainerStyles = {
  avatarContainer: css`
    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
  `,
};
