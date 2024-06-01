import React from 'react';
import { css } from '@emotion/react';
import { ActionButton } from '../../components/ActionButton';
import { Box } from '../../components/Box';
import { useThemeStore } from '../../store';

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

  const isBubble = useThemeStore((state) => state.isBubble);

  return (
    <Box
      css={[
        css`
          display: flex;
          flex-direction: column;
        `,

        isBubble &&
          css`
            padding: 2.5% 2.5% 0;
          `,
      ]}
    >
      <p
        css={[
          css`
            margin: 0;
          `,
        ]}
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
            font-size: 14px;
            opacity: 0.7;
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
          `}
        />
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
