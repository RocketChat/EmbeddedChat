import { css } from '@emotion/react';

const styles = {
  box: css`
    margin: 0;
    padding: 0;
    border-width: 0;
    box-sizing: border-box;
    border-style: solid;
    border-color: currentColor;
    outline: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    flex: 0 1 auto;
    &:hover {
      background-color: #f0f0f0; 
      transform: scale(1.05); 
    }
  `,
};

export default styles;
