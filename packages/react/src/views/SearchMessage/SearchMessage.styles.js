import { css } from '@emotion/react';

const styles = {
  searchListContainer: (messageList) => {
    const centerAlign = messageList.length === 0;
    return css`
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      justify-content: ${centerAlign ? 'center' : 'initial'};
      align-items: ${centerAlign ? 'center' : 'initial'};
      overflow-x: 'hidden';
      max-width: '100%';
    `;
  },

  centeredColumnStyles: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
};

export default styles;
