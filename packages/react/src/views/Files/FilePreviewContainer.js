import React from 'react';
import { Avatar } from '../../components/Avatar';
import { Box } from '../../components/Box';
import { filePreviewContainerStyles as styles } from './Files.styles';

const FilePreviewContainer = ({ file }) => (
  <Box css={styles.previewContainer}>
    <Avatar url={file.url} fallbackIcon="attachment" size="2.25em" />
  </Box>
);

export default FilePreviewContainer;
