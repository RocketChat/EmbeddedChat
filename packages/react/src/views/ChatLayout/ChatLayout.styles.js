import { css } from '@emotion/react';

const styles = {
  layout: css`
    flex-basis: 100%;
    display: flex;
    overflow: hidden;
    padding-top: 0.25rem;
  `,

  chatMain: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;
  `,
};

export default styles;
