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
  author,
  variantStyles,
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
  return (
    <Box>
      <Box
        css={[
          css`
            line-height: 0;
            border-radius: inherit;
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
                  padding: 0.5rem;
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
        <Box
          css={css`
            padding-left: 0.5rem;
          `}
        >
          <AttachmentMetadata
            attachment={attachment}
            url={host + (attachment.title_url || attachment.audio_url)}
            variantStyles={variantStyles}
            msg={msg}
          />
        </Box>
        <audio
          src={host + attachment.audio_url}
          width="100%"
          controls
          style={{
            paddingLeft: '0.5rem',
            paddingBottom: '0.5rem',
          }}
        />

        {attachment.attachments &&
          attachment.attachments.map((nestedAttachment, index) => (
            <Box key={index}>
              <Box
                css={[
                  css`
                    line-height: 0;
                    border-radius: inherit;
                    padding: 0.5rem;
                  `,
                  (nestedAttachment.type
                    ? variantStyles.pinnedContainer
                    : variantStyles.quoteContainer) ||
                    css`
                      ${nestedAttachment.type === 'file'
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
                          padding: 0.5rem;
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
                  </>
                ) : (
                  ''
                )}
                <Box
                  css={css`
                    padding-left: 0.5rem;
                  `}
                >
                  <AttachmentMetadata
                    attachment={nestedAttachment}
                    url={
                      host +
                      (nestedAttachment.title_url || nestedAttachment.audio_url)
                    }
                    variantStyles={variantStyles}
                  />
                </Box>
                <audio
                  src={host + nestedAttachment.audio_url}
                  width="100%"
                  controls
                  style={{
                    paddingLeft: '0.5rem',
                    paddingBottom: '0.5rem',
                  }}
                />
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
