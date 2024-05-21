import { css, useTheme } from '@emotion/react';

const useImageGalleryStyles = () => {
  const theme = useTheme();

  const overlay = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${theme.zIndex.modal};
    background-color: rgba(51, 51, 51, 0.7);
  `;

  const exit = css`
    position: absolute;
    top: 16px;
    right: 16px;
    background: #fff;
    color: #333;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    z-index: ${theme.zIndex.modal + 1};
  `;

  const imageContainer = css`
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
  `;

  const image = css`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  `;

  const throbberContainer = css`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const fetchErrorContainer = css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;

  return {
    overlay,
    exit,
    imageContainer,
    image,
    throbberContainer,
    fetchErrorContainer,
  };
};

export default useImageGalleryStyles;
