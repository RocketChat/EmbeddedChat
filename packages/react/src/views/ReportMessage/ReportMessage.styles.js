import { css } from '@emotion/react';

const styles = {
  conatiner: css`
    display: flex;
    justify-content: center;
    margin-bottom: 0.125rem;
    padding: 0.6rem 0.4rem;
  `,
  modal: {
    '@media(max-width: 602px)': {
      maxWidth: '87%',
    },
    '@media(max-width: 870px)': {
      maxWidth: '75%',
    },
  },
  modalTitle: css`
    @media (max-width: 602px) {
      font-size: 20px;
    }
  `,
};

export default styles;
