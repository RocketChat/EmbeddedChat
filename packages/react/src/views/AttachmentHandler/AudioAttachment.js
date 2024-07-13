import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import RCContext from '../../context/RCInstance';

const AudioAttachment = ({
  attachment,
  host,
  type,
  authorIcon,
  authorName,
  variantStyles,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { colors } = useTheme();
  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  return (
    <Box>
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
          url={host + (attachment.title_url || attachment.audio_url)}
          variantStyles={variantStyles}
        />
        <audio src={host + attachment.audio_url} width="100%" controls />

        {attachment.attachments ? (
          <Box>
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
                    ${attachment.attachments[0].type === 'file'
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
                      url={getUserAvatarUrl(attachment.author_icon)}
                      alt="avatar"
                      size="1.2em"
                    />
                    <Box>@{attachment.author_name}</Box>
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
                    attachment.attachments[0].audio_url)
                }
                variantStyles={variantStyles}
              />
              <audio
                src={host + attachment.attachments[0].audio_url}
                width="100%"
                controls
              />
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
