import React from 'react';
import { css } from '@emotion/react';
import { ActionButton } from '../../components/ActionButton';
import { Box } from '../../components/Box';

const AttachmentMetadata = ({ attachment, url }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const data = await response.blob();
      const downloadUrl = URL.createObjectURL(data);

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = attachment.title || 'download';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <>
      <p
        css={css`
          margin: 0;
        `}
      >
        {attachment.description}
      </p>
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <p
          css={css`
            margin: 0;
            color: grey;
          `}
        >
          {attachment.title}
        </p>
        <ActionButton
          ghost
          icon="download"
          size="small"
          onClick={handleDownload}
          css={css`
            margin-left: 10px;
            margin-top: 5px;
            color: grey;
          `}
        />
      </Box>
    </>
  );
};

export default AttachmentMetadata;
