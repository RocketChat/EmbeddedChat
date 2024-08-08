import { css } from '@emotion/react';

const styles = {
  layout: css`
    display: flex;
    height: 100%;
    overflow: hidden;
  `,

  chatMain: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
  `,

  sidebar: css`
    width: 350px;
  `,
};

export default styles;
