import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Avatar, Icon, useTheme } from '@embeddedchat/ui-elements';
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

  const { authorIcon, authorName } = author || {};

  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    return `${instanceHost}${icon}`;
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const fileUrl = host + attachment.title_link;

  return (
    <Box css={variantStyles.fileAttachmentContainer}>
      <Box
        css={[
          css`
            border-radius: inherit;
            padding: 0.5rem;
          `,
          type === 'file'
            ? css`
                border-radius: inherit;
                padding: 0.5rem;
              `
            : null,
        ]}
      >
        {type === 'file' && (
          <Box
            css={[
              css`
                display: flex;
                gap: 0.3rem;
                align-items: center;
                margin-bottom: 4px;
              `,
              variantStyles.textUserInfo,
            ]}
          >
            {authorIcon && (
              <Avatar
                url={getUserAvatarUrl(authorIcon)}
                alt="avatar"
                size="1.2em"
              />
            )}
            {authorName && <Box>@{authorName}</Box>}
          </Box>
        )}

        <AttachmentMetadata
          attachment={attachment}
          url={fileUrl}
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
              margin-top: 6px;
              border: 1px solid ${theme.colors.border};
              border-radius: ${theme.radius};
              padding: 0.5rem;
              gap: 0.5rem;
            `}
          >
            <Icon name="file" size="20px" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              css={css`
                margin-left: 6px;
                text-decoration: underline;
              `}
            >
              {attachment.title}
            </a>
          </Box>
        )}

        {attachment.attachments &&
          attachment.attachments.map((nestedAttachment, index) => {
            const nestedFileUrl = host + nestedAttachment.title_link;

            return (
              <Box
                key={index}
                css={[
                  css`
                    margin-top: 1rem;
                    border-radius: inherit;
                    padding: 0.5rem;
                  `,
                  nestedAttachment.type === 'file'
                    ? css`
                        border: 2px solid ${theme.colors.border};
                      `
                    : null,
                ]}
              >
                {nestedAttachment.author_icon && (
                  <Box
                    css={[
                      css`
                        display: flex;
                        gap: 0.3rem;
                        align-items: center;
                        margin-bottom: 4px;
                      `,
                      variantStyles.textUserInfo,
                    ]}
                  >
                    <Avatar
                      url={getUserAvatarUrl(nestedAttachment.author_icon)}
                      alt="avatar"
                      size="1.2em"
                    />
                    <Box>@{nestedAttachment.author_name}</Box>
                  </Box>
                )}

                <AttachmentMetadata
                  attachment={nestedAttachment}
                  url={nestedFileUrl}
                  variantStyles={variantStyles}
                />
                <Box
                  css={css`
                    display: flex;
                    align-items: center;
                    margin-top: 6px;
                  `}
                >
                  <Icon name="file" size="20px" />
                  <a
                    href={nestedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    css={css`
                      margin-left: 6px;
                      text-decoration: underline;
                    `}
                  >
                    {nestedAttachment.title}
                  </a>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

FileAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.shape({
    authorIcon: PropTypes.string,
    authorName: PropTypes.string,
  }),
  variantStyles: PropTypes.object,
  msg: PropTypes.object,
};

export default FileAttachment;
