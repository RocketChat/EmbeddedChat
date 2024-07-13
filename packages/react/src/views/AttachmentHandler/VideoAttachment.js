import React, { useContext } from 'react';
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
  authorIcon,
  authorName,
  variantStyles = {},
}) => {
  const { RCInstance } = useContext(RCContext);
  const { colors } = useTheme();
  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  return (
    <Box css={variantStyles.videoAttachmentContainer}>
      <Box
        css={[
          css`
            line-height: 0;
            border-radius: inherit;
            padding: 0.5rem;
          `,
          (type ? variantStyles.pinnedContainer : '') ||
            css`
              ${type === 'file' ? `border: 3px solid ${colors.border};` : ''}
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
          attachment={attachment}
          url={host + (attachment.title_url || attachment.video_url)}
          variantStyles={variantStyles}
        />
        <video
          width={300}
          controls
          style={{
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
          }}
        >
          <source
            src={host + attachment.video_url}
            type={userAgentMIMETypeFallback(attachment.video_type)}
          />
        </video>
        {attachment.attachments ? (
          <Box css={variantStyles.videoAttachmentContainer}>
            <Box
              css={[
                css`
                  line-height: 0;
                  border-radius: inherit;
                  padding: 0.5rem;
                `,
                (attachment.attachments[0].type
                  ? variantStyles.pinnedContainer
                  : variantStyles.quoteContainer) ||
                  css`
                    ${type === 'file'
                      ? `border: 3px solid ${colors.border};`
                      : ''}
                  `,
              ]}
            >
              {attachment.attachments[0].type === 'file' ? (
                <>
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
                </>
              ) : (
                ''
              )}
              <AttachmentMetadata
                attachment={attachment.attachments[0]}
                url={
                  host +
                  (attachment.attachments[0].title_url ||
                    attachment.attachments[0].video_url)
                }
                variantStyles={variantStyles}
              />
              <video
                width={300}
                controls
                style={{
                  borderBottomLeftRadius: 'inherit',
                  borderBottomRightRadius: 'inherit',
                }}
              >
                <source
                  src={host + attachment.attachments[0].video_url}
                  type={userAgentMIMETypeFallback(
                    attachment.attachments[0].video_type
                  )}
                />
              </video>
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
