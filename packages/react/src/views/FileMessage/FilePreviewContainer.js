import React from 'react';
import { Box, Avatar } from '@embeddedchat/ui-elements';
import { filePreviewContainerStyles as styles } from './Files.styles';

const FilePreviewContainer = ({ file }) => (
  <Box css={styles.previewContainer}>
    <Avatar url={file?.url} fallbackIcon="attachment" size="2.25em" />
  </Box>
);

export default FilePreviewContainer;
