import { css } from '@emotion/react';

const styles = {
  threadListContainer: (containsThreads, filteredThreads) => css`
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: ${!containsThreads || filteredThreads.length === 0
      ? 'center'
      : 'initial'};
    align-items: ${!containsThreads || filteredThreads.length === 0
      ? 'center'
      : 'initial'};
  `,

  noThreadInfo: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #4a4a4a;
  `,

  threadMessageContainer: css`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-top: 0.5rem;
    -webkit-padding-before: 0.5rem;
    padding-block-start: 0.5rem;
    padding-bottom: 0.25rem;
    -webkit-padding-after: 0.25rem;
    padding-block-end: 0.25rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-inline: 1.25rem;
    cursor: pointer;
    &:hover {
      background: #f2f3f5;
    }
  `,
};

export default styles;
