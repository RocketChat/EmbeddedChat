import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { ActionButton, Box, Tooltip } from '@embeddedchat/ui-elements';
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
  const [downloadUrl, setDownloadUrl] = React.useState(url);

  React.useEffect(() => {
    let isMounted = true;

    const prepareDownloadUrl = async () => {
      const { userId, authToken } = (await RCInstance.auth.getCurrentUser()) || {};
      if (!isMounted) return;
      if (userId && authToken) {
        const separator = url.includes('?') ? '&' : '?';
        setDownloadUrl(
          `${url}${separator}rc_uid=${encodeURIComponent(userId)}&rc_token=${encodeURIComponent(authToken)}`
        );
      } else {
        setDownloadUrl(url);
      }
    };

    prepareDownloadUrl();
    return () => {
      isMounted = false;
    };
  }, [RCInstance, url]);
  const getExtensionFromMimeType = (mimeType = '') => {
    if (!mimeType.includes('/')) return '';
    const rawExt = mimeType.split('/')[1].toLowerCase();
    if (rawExt === 'mpeg') return 'mp3';
    if (rawExt === 'jpeg') return 'jpg';
    return rawExt;
  };

  const getDownloadFileName = (blobType = '') => {
    const baseName = (attachment?.title || 'download').trim();
    const hasExtension = /\.[a-z0-9]+$/i.test(baseName);
    const extensionFromBlob = getExtensionFromMimeType(blobType);

    const isMediaAttachment = Boolean(
      attachment?.audio_url || attachment?.video_url || attachment?.image_url
    );

    if (!isMediaAttachment) {
      return baseName;
    }

    if (!hasExtension && extensionFromBlob) {
      return `${baseName}.${extensionFromBlob}`;
    }

    if (hasExtension && extensionFromBlob) {
      const currentExtension = baseName.split('.').pop().toLowerCase();
      if (
        (attachment?.audio_url || attachment?.video_url || attachment?.image_url) &&
        ['txt', 'text'].includes(currentExtension)
      ) {
        return `${baseName.replace(/\.[^.]+$/, '')}.${extensionFromBlob}`;
      }
    }

    return baseName;
  };

  const handleDownload = async () => {
    try {
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = getDownloadFileName(attachment?.audio_type || attachment?.video_type || attachment?.image_type || '');

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
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
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default AttachmentMetadata;
