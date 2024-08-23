import { css } from '@emotion/react';
import { alpha } from '@embeddedchat/ui-elements';

const getImageGalleryStyles = (theme) => {
  const styles = {
    overlay: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1500;
      background-color: ${alpha(theme.commonColors.black, 0.5)};
    `,

    exit: css`
      position: absolute;
      top: 16px;
      right: 16px;
      background: ${theme.colors.primary};
      color: ${theme.colors.primaryForeground};
      border: none;
      border-radius: ${theme.radius};
      padding: 8px 16px;
      cursor: pointer;
      z-index: 1501;
    `,

    imageContainer: css`
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
    `,

    image: css`
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    `,

    throbberContainer: css`
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    `,

    fetchErrorContainer: css`
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `,

    swiperContainer: css`
      width: 100%;
      height: 100%;
      overflow: hidden;
    `,

    swiperInject: `
    .swiper-button-next,
    .swiper-button-prev {
      color: ${theme.colors.primary};
    }
  `,
  };

  return styles;
};

export default getImageGalleryStyles;
