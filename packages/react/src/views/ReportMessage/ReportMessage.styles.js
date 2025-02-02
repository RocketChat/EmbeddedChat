import { css } from '@emotion/react';

const styles = {
  conatiner: css`
    display: flex;
    justify-content: center;
    margin-bottom: 0.125rem;
    padding: 0.6rem 0.4rem;
  `,
  modal: {
    '@media(max-width: 320px)': {
      maxWidth: '90%',
    },
    '@media(max-width: 480px)': {
      maxWidth: '90%',
    },
    '@media(max-width: 600px)': {
      maxWidth: '65%',
    },
    '@media(max-width: 768px)': {
      maxWidth: '80%',
    },
  },
  modalTitle: css`
    @media (max-width: 400px) {
      font-size: 16px;
    }
    ,
    @media (max-width: 690px) {
      font-size: 18px;
    }
    ,
    @media (max-width: 768px) {
      font-size: 20px;
    }
  `,
};

export default styles;
