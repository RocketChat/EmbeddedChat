import { css } from '@emotion/react';

const styles = {
  inputContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    margin: 20px 0 0 0 !important;
  `,

  input: css`
    margin-top: 5px;
    border: 1px solid rgb(184, 184, 184);
    width: 95.5%;
    padding: 10px !important;
    border-radius: 5px;
  `,

  submitBtn: css`
    &:hover {
      background-color: #005bb6;
    }

    &:active {
      background-color: #003f7e;
    }

    &.disabled:not(.ghost) {
      background-color: rgb(148, 157, 161);
    }
  `,

  modalContent: css`
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 350px;
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
};

export default styles;
