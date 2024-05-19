import { css } from '@emotion/react';

const styles = {
  fieldContainer: css`
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    flex-shrink: 0;
    width: 100%;
  `,

  fieldLabel: css`
    flex: 1 1 0;
    align-self: flex-start;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-block: 0.125rem;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
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
  `,

  passwordEye: css`
    cursor: pointer;
    position: absolute;
    right: 1em;
  `,
};

export default styles;
