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
      anchor.download = attachment?.title || 'download';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const getFormattedFileSize = () => {
    let sizeInBytes;

    if (attachment?.image_type && attachment?.image_size) {
      sizeInBytes = attachment.image_size;
    } else if (attachment?.video_type && attachment?.video_size) {
      sizeInBytes = attachment.video_size;
    } else if (attachment?.audio_type && attachment?.audio_size) {
      sizeInBytes = attachment.audio_size;
    } else if (attachment?.size) {
      sizeInBytes = attachment.size;
    } else {
      sizeInBytes = 0;
    }

    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${sizeInKB} kB`;
  };

  return (
    <Box
      css={[
        css`
          display: flex;
          flex-direction: column;
          @media (max-width: 420px) {
            flex-direction: column;
            align-items: flex-start;
          }
        `,
        variantStyles.attachmentMetaContainer,
      ]}
    >
      {attachment?.description && (
        <div
          css={css`
            margin: 10px 0px;
            @media (max-width: 420px) {
              margin: 5px 0px;
            }
          `}
        >
          {msg ? (
            <Markdown body={msg} md={attachment?.descriptionMd} />
          ) : (
            attachment?.description
          )}
        </div>
      )}

      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          @media (max-width: 420px) {
            flex-direction: column;
            align-items: flex-start;
          }
        `}
      >
        <Box
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4px;
            @media (max-width: 420px) {
              flex-direction: column;
              align-items: flex-start;
            }
          `}
        >
          <Tooltip text={attachment?.title} position="down">
            <p
              css={css`
                margin: 0;
                font-size: 12px;
                opacity: 0.7;
              `}
            >
              {attachment?.title?.length > 22
                ? `${attachment.title.substring(0, 22)}...`
                : attachment?.title}
            </p>
          </Tooltip>
          <Box
            css={css`
              font-size: 12px;
              opacity: 0.7;
              @media (max-width: 420px) {
                margin-left: 0;
              }
            `}
          >
            ({getFormattedFileSize()})
          </Box>
        </Box>

        <Box
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            @media (max-width: 420px) {
              margin-top: 5px;
            }
          `}
        >
          <Tooltip text={isExpanded ? 'Collapse' : 'Expand'} position="top">
            <ActionButton
              ghost
              icon={isExpanded ? 'chevron-down' : 'chevron-left'}
              size="small"
              onClick={onExpandCollapseClick}
            />
          </Tooltip>
          <Tooltip text="Download" position="top">
            <ActionButton
              ghost
              icon="download"
              size="small"
              onClick={handleDownload}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
