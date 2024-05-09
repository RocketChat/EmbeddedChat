import { css } from '@emotion/react';

const styles = {
  channelStateContainer: css`
    font-size: 0.75rem;
    padding: 0 0.25rem;
    z-index: 100;
    display: flex;
    justify-content: space-between;
  `,

  channelStateMessage: css`
    background-color: #cbced1;
    padding: 0 0.25rem;
    display: flex;
    gap: 0.1rem;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    color: #2f343d;
  `,
};

export default styles;
