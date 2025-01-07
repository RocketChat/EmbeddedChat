import React from 'react';
import { css } from '@emotion/react';
import { ActionButton, Box, Tooltip } from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';

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
      <div
        css={
          attachment.description !== ''
            ? [
                css`
                  margin: 10px 0px;
                `,
              ]
            : css`
                margin: -7px 0px;
              `
        }
      >
        {msg ? (
          <Markdown body={msg} md={attachment.descriptionMd} />
        ) : (
          attachment.description
        )}
      </div>
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <Tooltip text={attachment.title} position="down">
          <p
            css={
              attachment.description
                ? [
                    css`
                      margin: 3px 0 0 0;
                      font-size: 12px;
                      opacity: 0.7;
                    `,
                  ]
                : css`
                    margin: 22px 0 15px 0;
                    font-size: 12px;
                    opacity: 0.7;
                  `
            }
          >
            {attachment.title.length > 24
              ? `${attachment.title.substring(0, 24)}...`
              : attachment.title}
          </p>
        </Tooltip>
        <Box
          css={
            attachment.description
              ? [
                  css`
                    font-size: 12px;
                    opacity: 0.7;
                    margin-left: 3px;
                    margin-top: 2px;
                  `,
                ]
              : css`
                  font-size: 12px;
                  opacity: 0.7;
                  margin-left: 3px;
                  margin-top: 7px;
                `
          }
        >
          (
          {attachment.image_size
            ? (attachment.image_size / 1024).toFixed(2)
            : 0}{' '}
          kB)
        </Box>

        <Tooltip text={isExpanded ? 'Collapse' : 'Expand'} position="top">
          <ActionButton
            ghost
            icon={isExpanded ? 'chevron-down' : 'chevron-left'}
            size="small"
            onClick={() => {
              onExpandCollapseClick();
            }}
            css={css`
              margin-left: 10px;
              margin-top: ${attachment.description ? '3px' : '10px'};
            `}
          />
        </Tooltip>
        <Tooltip text="Download" position="top">
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
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
