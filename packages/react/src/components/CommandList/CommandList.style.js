import { css } from '@emotion/react';

const styles = {
  list: css`
    margin-bottom: 5px;
    display: block;
    max-height: 10rem;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 145px;
    scrollbar-width: thin;
    scrollbar-color: #e0e0e1 transparent;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e0e0e1;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #e0e0e1;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `,

  listItem: css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    padding-right: 2px;

    &:hover {
      background-color: #dddddd;
    }
  `,
};

export default styles;
