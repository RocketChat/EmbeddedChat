import React from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar';
import { Box } from '../Box';
import { Icon } from '../Icon';

const FilePreviewContainer = ({ file, sequential, isStarred }) => {
  const FilePreviewContainerCss = css`
    margin: 3px;
    width: 2.25em;
    max-height: 2.25em;
    display: flex;
    justify-content: flex-end;
  `;

  return (
    <Box css={FilePreviewContainerCss}>
      {!sequential ? (
        <Avatar url={file.url} alt="file" size="2.25em" />
      ) : isStarred ? (
        <Icon style={{ opacity: 0.5 }} name="star-filled" size="1.2em" />
      ) : null}
    </Box>
  );
};

export default FilePreviewContainer;
