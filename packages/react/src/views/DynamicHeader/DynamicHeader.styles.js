import { css } from '@emotion/react';

const useDynamicHeaderStyles = () => {
  const styles = {
    container: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      z-index: 1200;
      padding-block-start: 10px;
    `,

    clearSpacing: css`
      margin: 0;
      padding: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `,
  };

  return styles;
};

export default useDynamicHeaderStyles;
