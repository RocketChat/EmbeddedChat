import { css } from '@emotion/react';

const styles = {
  fieldContainer: css`
    display: flex;
    flex-direction: column;
    padding: 0.35rem 0.2rem;
    position: relative;
  `,

  fieldLabel: css`
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-block: 0.125rem;
    letter-spacing: 0.03em;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.25rem;
    text-transform: uppercase;
    color: #555e6d;
  `,

  fieldRow: css`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.25rem;
    -webkit-margin-before: 0.25rem;
    margin-block-start: 0.25rem;
    margin-bottom: 0.125rem;
    -webkit-margin-after: 0.125rem;
    margin-block-end: 0.125rem;
    position: relative;
    border-radius: 8px;
    transition: box-shadow 0.2s ease;

    &:focus-within {
      box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.1);
      border-radius: 8px;
    }

    input {
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.9rem;
      padding: 0.6rem 0.85rem;
      width: 100%;
      transition: border-color 0.2s ease, background 0.2s ease;

      &:focus {
        background: #fff;
        border-color: #1e293b;
        outline: none;
      }

      &::placeholder {
        color: #b0bac6;
        font-size: 0.875rem;
      }
    }
  `,

  passwordEye: css`
    cursor: pointer;
    position: absolute;
    right: 0.85em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8896a7;
    transition: color 0.15s ease;
    z-index: 1;

    &:hover {
      color: #1e293b;
    }
  `,
};

export default styles;