import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import RCContext from '../../context/RCInstance';

const userAgentMIMETypeFallback = (type) => {
  const userAgent = navigator.userAgent.toLocaleLowerCase();

  if (type === 'video/quicktime' && userAgent.indexOf('safari') !== -1) {
    return 'video/mp4';
  }

  return type;
};

const VideoAttachment = ({
  attachment,
  host,
  type,
  author,
  variantStyles = {},
  msg,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  const { authorIcon, authorName } = author;

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <Box css={variantStyles.videoAttachmentContainer}>
      <Box
        css={[
          css`
            line-height: 0;
            border-radius: inherit;
            padding: 0.5rem;
            @media (max-width: 450px) {
              padding: 0.3rem;
            }
          `,
          (type ? variantStyles.pinnedContainer : '') ||
            css`
              ${type === 'file'
                ? `border: 3px solid ${theme.colors.border};`
                : ''}
            `,
        ]}
      >
        {type === 'file' ? (
          <>
            <Box
              css={[
                css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                  @media (max-width: 450px) {
                    align-items: flex-start;
                  }
                `,
                variantStyles.textUserInfo,
              ]}
            >
              <Avatar
                url={getUserAvatarUrl(authorIcon)}
                alt="avatar"
                size="1.2em"
              />
              <Box
                css={css`
                  @media (max-width: 450px) {
                    margin-top: 0.5rem;
                  }
                `}
              >
                @{authorName}
              </Box>
            </Box>
          </>
        ) : (
          ''
        )}
        <Box
          css={css`
            @media (max-width: 450px) {
              margin-top: 0.4rem;
            }
          `}
        >
          <AttachmentMetadata
            attachment={attachment}
            url={host + (attachment.title_url || attachment.video_url)}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        </Box>
        {isExpanded && (
          <video
            controls
            style={{
              borderBottomLeftRadius: 'inherit',
              borderBottomRightRadius: 'inherit',
              maxWidth: '100%',
              maxHeight: '200px',
            }}
          >
            <source
              src={host + attachment.video_url}
              type={userAgentMIMETypeFallback(attachment.video_type)}
            />
          </video>
        )}
        {attachment.attachments &&
          attachment.attachments.map((nestedAttachment, index) => (
            <Box css={variantStyles.videoAttachmentContainer} key={index}>
              <Box
                css={[
                  css`
                    line-height: 0;
                    border-radius: inherit;
                    padding: 0.5rem;
                    @media (max-width: 450px) {
                      padding: 0.3rem;
                    }
                  `,
                  (nestedAttachment.type
                    ? variantStyles.pinnedContainer
                    : variantStyles.quoteContainer) ||
                    css`
                      ${type === 'file'
                        ? `border: 3px solid ${theme.colors.border};`
                        : ''}
                    `,
                ]}
              >
                {nestedAttachment.type === 'file' ? (
                  <>
                    <Box
                      css={[
                        css`
                          display: flex;
                          gap: 0.3rem;
                          align-items: center;
                          @media (max-width: 450px) {
                            flex-direction: column;
                            align-items: flex-start;
                          }
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
                  </>
                ) : (
                  ''
                )}
                <AttachmentMetadata
                  attachment={nestedAttachment}
                  url={
                    host +
                    (nestedAttachment.title_url || nestedAttachment.video_url)
                  }
                  variantStyles={variantStyles}
                />
                <video
                  width="100%"
                  controls
                  style={{
                    borderBottomLeftRadius: 'inherit',
                    borderBottomRightRadius: 'inherit',
                    maxWidth: '300px',
                  }}
                >
                  <source
                    src={host + attachment.video_url}
                    type={userAgentMIMETypeFallback(
                      nestedAttachment.video_type
                    )}
                  />
                </video>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
