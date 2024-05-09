import React from 'react';
import { dropBoxOverlayStyles as styles } from './DropBox.styles';

const DropBoxOverlay = () => (
  <div css={styles.overlay}>
    <h1 style={{ textDecoration: 'solid' }}>
      <b>Drop to upload file</b>
    </h1>
  </div>
);

export default DropBoxOverlay;
