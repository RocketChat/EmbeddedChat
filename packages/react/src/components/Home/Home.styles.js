import { css } from '@emotion/react';

const styles = {
  paraText: css`
    margin-top: 1rem;
    font-size: 1rem;
  `,

  paraTextMediaQuery: css`
    @media (max-width: 768px) {
      margin-top: 0.5rem;
      font-size: 0.775rem;
      line-height: 1rem;
    }
  `,
};

export default styles;
