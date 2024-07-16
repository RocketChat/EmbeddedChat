import { css } from '@emotion/react';

export const getChatLayoutStyles = () => {
  const styles = {
    layout: css`
      height: 100%;
      display: flex;
      overflow: hidden;
    `,

    chatMain: css`
      display: flex;
      flex-direction: column;
      height: 100%;
      flex: 1;
      position: relative;
    `,
  };

  return styles;
};
