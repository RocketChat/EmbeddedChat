import React from 'react';
import { ActionButton } from '../ActionButton';
import { Box } from '../Box';

const AttachmentMetadata = ({ attachment, url }) => {
  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = attachment.title;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
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
