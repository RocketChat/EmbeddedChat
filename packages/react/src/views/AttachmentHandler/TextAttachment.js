import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme, Icon } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import RCContext from '../../context/RCInstance';
import { Markdown } from '../Markdown';

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
        {attachment?.author_name && (
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
              url={getUserAvatarUrl(attachment?.author_icon)}
              alt="avatar"
              size="1.2em"
            />
            <Box>@{attachment?.author_name}</Box>
          </Box>
        )}

        {!attachment?.text && !attachment?.attachments && (
          <AttachmentMetadata
            attachment={attachment}
            url={host + attachment.title_link}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        )}
        {isExpanded && (attachment?.title_link || attachment?.text) && (
          <Box
            css={css`
              margin-top: 0.5rem;
              white-space: pre-line;
              background: ${theme.colors.background};
              padding: 8px 12px;
              border-radius: 4px;
              border: 1px solid ${theme.colors.border};
              line-height: normal;
            `}
          >
            {attachment?.text ? (
              attachment.text[0] === '[' ? (
                attachment.text.match(/\n(.*)/)?.[1] || ''
              ) : (
                <Markdown
                  body={attachment.text}
                  md={attachment.md}
                  isReaction={false}
                />
              )
            ) : !attachment.attachments ? (
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
            ) : (
              ''
            )}
          </Box>
        )}
        {attachment?.attachments &&
          Array.isArray(attachment.attachments) &&
          attachment.attachments.map((nestedAttachment, index) => (
            <Box
              css={[
                css`
                  display: flex;
                  flex-direction: column;
                  letter-spacing: 0rem;
                  font-size: 0.875rem;
                  font-weight: 400;
                  word-break: break-word;
                  border-inline-start: 3px solid ${theme.colors.border};
                  margin-top: 0.75rem;
                  padding: 0.5rem;
                `,
                (nestedAttachment?.type ? variantStyles.pinnedContainer : '') ||
                  css`
                    ${!attachment?.type
                      ? `border: 2px solid ${theme.colors.border};`
                      : ''}
                  `,
                css`
                  ${variantStyles.name !== undefined &&
                  variantStyles.name.includes('bubble')
                    ? `border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem`
                    : ''}
                `,
              ]}
              key={index}
            >
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
                {nestedAttachment?.author_name && (
                  <>
                    <Avatar
                      url={getUserAvatarUrl(nestedAttachment?.author_icon)}
                      alt="avatar"
                      size="1.2em"
                    />
                    <Box>@{nestedAttachment?.author_name}</Box>
                  </>
                )}
              </Box>

              <AttachmentMetadata
                attachment={nestedAttachment}
                url={host + (nestedAttachment?.title_link || '')}
                variantStyles={variantStyles}
                onExpandCollapseClick={toggleExpanded}
                isExpanded={isExpanded}
              />

              {isExpanded && (
                <Box
                  css={css`
                    margin-top: 0.5rem;
                    white-space: pre-line;
                  `}
                >
                  {nestedAttachment?.text ? (
                    nestedAttachment.text[0] === '[' ? (
                      nestedAttachment.text.match(/\n(.*)/)?.[1] || ''
                    ) : (
                      <Markdown
                        body={nestedAttachment.text}
                        md={nestedAttachment.md}
                        isReaction={false}
                      />
                    )
                  ) : (
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
                          href={host + (nestedAttachment?.title_link || ' ')}
                          download={nestedAttachment?.title_link_download}
                          css={css`
                            text-decoration: none;
                            font-size: 0.875rem;
                            &:hover {
                              text-decoration: underline;
                            }
                          `}
                        >
                          {nestedAttachment?.title}
                        </a>
                        <Box
                          css={css`
                            font-size: 0.75rem;
                          `}
                        >
                          {getFileSizeWithFormat(
                            nestedAttachment?.size,
                            nestedAttachment?.format
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ))}
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
