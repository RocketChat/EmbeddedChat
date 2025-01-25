import React from 'react';
import { css } from '@emotion/react';
import { ActionButton, Box } from '@embeddedchat/ui-elements';

const AttachmentMetadata = ({
  attachment,
  url,
  variantStyles = {},
  msg,
  onExpandCollapseClick,
  isExpanded,
}) => {
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
    <Box
      css={[
        css`
          display: flex;
          flex-direction: column;
        `,
        variantStyles.attachmentMetaContainer,
      ]}
    >
      <p
        css={[
          css`
            margin-top: ${attachment.description ? '0.5rem' : '-3px'};
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
          margin-top: ${attachment.description ? '0.5rem' : '0px'};
        `}
      >
        <p
          css={css`
            font-size: 14px;
            opacity: 0.7;
          `}
        >
          {attachment.title}
        </p>
        <ActionButton
          ghost
          icon={isExpanded ? 'chevron-down' : 'chevron-left'}
          size="small"
          onClick={onExpandCollapseClick}
          css={css`
            margin-left: 10px;
            margin-top: 1px;
          `}
        />
        <ActionButton
          ghost
          icon="download"
          size="small"
          onClick={handleDownload}
          css={css`
            margin-left: 10px;
            margin-top: 3px;
          `}
        />
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
