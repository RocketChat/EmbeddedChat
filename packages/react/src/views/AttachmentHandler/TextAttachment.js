import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme, Icon } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import RCContext from '../../context/RCInstance';

const FileAttachment = ({
  attachment,
  host,
  type,
  author,
  variantStyles = {},
  msg,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    return `${instanceHost}${icon}`;
  };

  const { authorIcon, authorName } = author;

  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const unitIndex = Math.min(i, units.length - 1);

    const size = bytes / k ** unitIndex;
    const decimals = unitIndex === 0 ? 0 : unitIndex === 1 ? 1 : 2;

    return `${size.toFixed(decimals)} ${units[unitIndex]}`;
  };

  const getFileSizeWithFormat = (size, format) => {
    const formattedSize = formatFileSize(size);
    return format ? `${formattedSize} - ${format}` : formattedSize;
  };

  return (
    <Box css={variantStyles.fileAttachmentContainer}>
      <Box
        css={[
          css`
            border-radius: 4px;
            line-height: 0;
            padding: 0.5rem;
            background: ${theme.colors.background};
          `,
          (type ? variantStyles.pinnedContainer : '') ||
            css`
              ${type === 'file'
                ? `border: 2px solid ${theme.colors.border};`
                : ''}
            `,
        ]}
      >
        {type === 'file' && (
          <Box
            css={[
              css`
                display: flex;
                gap: 0.3rem;
                align-items: center;
              `,
              variantStyles.textUserInfo,
            ]}
          >
            <Avatar
              url={getUserAvatarUrl(authorIcon)}
              alt="avatar"
              size="1.2em"
            />
            <Box>@{authorName}</Box>
          </Box>
        )}
        <AttachmentMetadata
          attachment={attachment}
          url={host + attachment.title_link}
          variantStyles={variantStyles}
          msg={msg}
          onExpandCollapseClick={toggleExpanded}
          isExpanded={isExpanded}
        />
        {isExpanded && (
          <Box
            css={css`
              display: flex;
              align-items: center;
              margin-top: 0.5rem;
              background: ${theme.colors.background};
              padding: 8px 12px;
              border-radius: 4px;
              gap: 8px;
              border: 1px solid ${theme.colors.border};
            `}
          >
            <Icon name="file" size="40px" />
            <Box
              css={css`
                display: flex;
                flex-direction: column;
                gap: 2px;
                line-height: normal;
              `}
            >
              <a
                href={host + attachment.title_link}
                download={attachment.title_link_download}
                css={css`
                  text-decoration: none;
                  font-size: 0.875rem;
                  &:hover {
                    text-decoration: underline;
                  }
                `}
              >
                {attachment.title}
              </a>
              <Box
                css={css`
                  font-size: 0.75rem;
                `}
              >
                {getFileSizeWithFormat(attachment.size, attachment.format)}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileAttachment;

FileAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.object,
  variantStyles: PropTypes.object,
  msg: PropTypes.object,
};
