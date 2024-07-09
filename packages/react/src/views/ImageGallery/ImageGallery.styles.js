import { css } from '@emotion/react';
import { useTheme, alpha } from '@embeddedchat/ui-elements';

const useImageGalleryStyles = () => {
  const { theme, colors } = useTheme();

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
    border-radius: ${theme.schemes.radius};
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

  const swiperContainer = css`
    width: 100%;
    height: 100%;
    overflow: hidden;
  `;

  const swiperInject = `
    .swiper-button-next,
    .swiper-button-prev {
      color: ${colors.primary};
    }
  `;

  return {
    overlay,
    exit,
    imageContainer,
    image,
    throbberContainer,
    fetchErrorContainer,
    swiperContainer,
    swiperInject,
  };
};

export default useImageGalleryStyles;
