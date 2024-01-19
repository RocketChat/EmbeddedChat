import { css } from '@emotion/react';

const dropBoxStyles = {
   dropBoxCss: css`
      z-index: 300;
      opacity: 25%;
      flex-direction: column;
      animation-name: inherit;
      animation-duration: 0.1s;
      transition: all 0.1s ease-in;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; 
`,

   borderCss: css`
      position: relative;
      top: 0;
      left: 0;
      z-index: 9999; 
      border: 4px dashed #007fff !important;
  `,
};

export default dropBoxStyles;