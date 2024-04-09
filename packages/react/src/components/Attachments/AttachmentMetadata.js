import React from 'react';
import { ActionButton } from '../ActionButton';
import { Box } from '../Box';

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
      <p style={{ margin: 0 }}>{attachment.description}</p>
      <Box
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <p style={{ margin: 0, color: 'grey' }}>{attachment.title}</p>
        <ActionButton
          ghost
          icon="download"
          size="small"
          onClick={handleDownload}
          style={{
            marginLeft: '10px',
            marginTop: '5px',
            color: 'grey',
          }}
        />
      </Box>
    </>
  );
};

export default AttachmentMetadata;
