import React from 'react';
import { css } from '@emotion/react';

const DropBoxOverlay = () => {
  const overlayCss = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #007fff;
    z-index: 10000;
  `;

  return (
    <div css={overlayCss}>
      <h1 style={{ textDecoration: 'solid' }}>
        <b>Drop to upload file</b>
      </h1>
    </div>
  );
};

export default DropBoxOverlay;
