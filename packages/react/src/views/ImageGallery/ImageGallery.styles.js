import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { alpha } from '../../lib/color';

const useImageGalleryStyles = () => {
  const { theme, colors } = useCustomTheme();

  const overlay = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${theme.zIndex.modal};
    background-color: ${alpha(theme.schemes.common.black, 0.5)};
  `;

  const exit = css`
    position: absolute;
    top: 16px;
    right: 16px;
    background: ${colors.primary};
    color: ${colors.primaryForeground};
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
