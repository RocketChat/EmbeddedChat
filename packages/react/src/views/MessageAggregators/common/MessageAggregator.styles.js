import { css } from '@emotion/react';

const getMessageAggregatorStyles = () => {
  const styles = {
    listContainerStyles: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      max-width: 100%;
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
