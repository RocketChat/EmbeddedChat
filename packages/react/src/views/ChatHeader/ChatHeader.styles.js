import { css } from '@emotion/react';

const rowCentreAlign = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const styles = {
  clearSpacing: css`
    margin: 0;
    padding: 0;
  `,

  chatHeaderChild: css`
    ${rowCentreAlign}
    justify-content: space-between;
    width: 100%;
  `,
  chatHeaderParent: css`
    width: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    box-shadow: 0 3px 2px -2px grey;
  `,

  channelDescription: css`
    ${rowCentreAlign}
    gap: 0.5rem;
  `,

  chatHeaderIconRow: css`
    ${rowCentreAlign}
    gap:0.5rem
  `,
};

export default styles;
