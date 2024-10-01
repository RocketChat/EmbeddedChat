import { css } from '@emotion/react';

const getMessageAggregatorStyles = (theme) => {
  const styles = {
    listContainerStyles: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: initial;
      align-items: initial;
      max-width: 100%;
      overflow-y: auto;
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
    sidebarStyles: {
      position: 'absolute',
      left: '0',
      bottom: '0',
      top: '2',
      width: '100%',
      height: '93%',
      zIndex: 1,
    },
  };

  return styles;
};

export default getMessageAggregatorStyles;
