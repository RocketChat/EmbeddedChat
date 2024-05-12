import React from 'react';
import { Box } from '../Box';
import { dropBoxOverlayStyles as styles } from './DropBox.styles';

const DropBoxOverlay = () => (
  <Box css={styles.overlay}>
    <h1 style={{ textDecoration: 'solid' }}>
      <b>Drop to upload file</b>
    </h1>
  </Box>
);

export default DropBoxOverlay;
