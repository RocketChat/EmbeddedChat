import { css } from '@emotion/react';

const getMessageAggregatorStyles = () => {
  const styles = {
    listContainerStyles: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      width: 300px;
      @media (max-width: 780px) {
        width: 100vw;
      }
    `,

    noMessageStyles: css`
      justify-content: center;
      align-items: center;
    `,

    centerColumnStyles: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
  };

  return styles;
};

export default getMessageAggregatorStyles;
