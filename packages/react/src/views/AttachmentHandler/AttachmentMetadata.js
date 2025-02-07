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
          @media (max-width: 420px) {
            flex-direction: column;
            align-items: flex-start;
          }
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
                  @media (max-width: 420px) {
                    margin: 5px 0px;
                  }
                `,
              ]
            : css`
                margin: -7px 0px;
                @media (max-width: 420px) {
                  margin: -5px 0px;
                }
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
            @media (max-width: 420px) {
              flex-direction: column;
              align-items: flex-start;
            }
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
                        @media (max-width: 420px) {
                          margin: 8px 0 0 0;
                        }
                      `,
                    ]
                  : css`
                      margin: 22px 0 15px 0;
                      font-size: 12px;
                      opacity: 0.7;
                      @media (max-width: 420px) {
                        margin: 10px 0 10px 0;
                      }
                    `
              }
            >
              {attachment.title.length > 22
                ? `${attachment.title.substring(0, 22)}...`
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
                      @media (max-width: 420px) {
                        display: none;
                      }
                    `,
                  ]
                : css`
                    font-size: 12px;
                    opacity: 0.7;
                    margin-left: 3px;
                    margin-top: 7px;
                    @media (max-width: 420px) {
                      margin-left: 0;
                      margin-top: 5px;
                    }
                  `
            }
          >
            (
            {attachment.image_size
              ? (attachment.image_size / 1024).toFixed(2)
              : 0}{' '}
            kB)
          </Box>
        </Box>
        <Box
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            @media (max-width: 420px) {
              flex-direction: row;
              align-items: flex-start;
            }
          `}
        >
          <Box
            css={css`
              margin-left: 10px;
              margin-top: ${attachment.description ? '3px' : '10px'};
              @media (max-width: 420px) {
                margin-left: 0;
                margin-top: 5px;
              }
            `}
          >
            <Tooltip text={isExpanded ? 'Collapse' : 'Expand'} position="top">
              <ActionButton
                ghost
                icon={isExpanded ? 'chevron-down' : 'chevron-left'}
                size="small"
                onClick={() => {
                  onExpandCollapseClick();
                }}
              />
            </Tooltip>
          </Box>
          <Box
            css={css`
              margin-left: 10px;
              margin-top: 5px;
              @media (max-width: 420px) {
                margin-left: 0;
                margin-top: 5px;
              }
            `}
          >
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
    </Box>
  );
};

export default AttachmentMetadata;
