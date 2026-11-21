import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Tooltip,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import { Markdown } from '../Markdown';
import RCContext from '../../context/RCInstance';

const AttachmentMetadata = ({
  attachment,
  url,
  variantStyles = {},
  msg,
  onExpandCollapseClick,
  isExpanded,
}) => {
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      let fetchOptions;

      const isHttpUrl = /^https?:\/\//i.test(url);
      if (isHttpUrl) {
        fetchOptions = {
          redirect: 'error',
        };

        if (RCInstance) {
          try {
            const targetUrl = new URL(url);
            const host = RCInstance.getHost?.() || '';
            const hostUrl = host ? new URL(host) : null;
            if (
              hostUrl &&
              targetUrl.origin === hostUrl.origin &&
              targetUrl.pathname.startsWith('/file-upload/')
            ) {
              const token =
                RCInstance?.auth?.currentUser?.authToken ||
                RCInstance?.token ||
                null;
              const userId =
                RCInstance?.auth?.currentUser?.userId ||
                RCInstance?.userId ||
                null;
              if (token && userId) {
                fetchOptions.headers = {
                  'X-Auth-Token': token,
                  'X-User-Id': userId,
                };
              }
            }
          } catch (_) {
            // Ignore URL parse failure and proceed with standard fetch
          }
        }
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          dispatchToastMessage({
            type: 'error',
            message:
              'Access denied. You do not have permission to download this file.',
          });
        } else {
          dispatchToastMessage({
            type: 'error',
            message: `Download failed with status ${response.status}`,
          });
        }
        return;
      }

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
      dispatchToastMessage({
        type: 'error',
        message: 'Error downloading the file. Please try again.',
      });
    } finally {
      setIsDownloading(false);
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
      return null;
    }

    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${sizeInKB} kB`;
  };

  const fileSize = getFormattedFileSize();

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
          {fileSize && (
            <Box
              css={css`
                font-size: 12px;
                opacity: 0.7;
                @media (max-width: 420px) {
                  margin-left: 0;
                }
              `}
            >
              ({fileSize})
            </Box>
          )}
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
              disabled={isDownloading}
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

AttachmentMetadata.propTypes = {
  attachment: PropTypes.object,
  url: PropTypes.string,
  variantStyles: PropTypes.object,
  msg: PropTypes.any,
  onExpandCollapseClick: PropTypes.func,
  isExpanded: PropTypes.bool,
};

export default AttachmentMetadata;
