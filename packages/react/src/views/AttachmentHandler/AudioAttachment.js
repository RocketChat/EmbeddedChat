import React, { useState, useContext, useEffect } from 'react';
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

  const [isExpanded, setIsExpanded] = useState(true);
  const [audioSrc, setAudioSrc] = useState('');
  const [nestedAudioSrcMap, setNestedAudioSrcMap] = useState({});
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    let isMounted = true;
    const loadAudioWithAuth = async () => {
      const { userId, authToken } = (await RCInstance.auth.getCurrentUser()) || {};
      const sourceUrl = host + attachment.audio_url;
      if (!isMounted) return;
      if (userId && authToken) {
        const separator = sourceUrl.includes('?') ? '&' : '?';
        setAudioSrc(
          `${sourceUrl}${separator}rc_uid=${encodeURIComponent(userId)}&rc_token=${encodeURIComponent(authToken)}`
        );
      } else {
        setAudioSrc(sourceUrl);
      }
    };

    if (attachment?.audio_url) {
      loadAudioWithAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [RCInstance, attachment?.audio_url, host]);

  useEffect(() => {
    let isMounted = true;

    const loadNestedAudio = async () => {
      if (!attachment?.attachments?.length) return;

      const { userId, authToken } = (await RCInstance.auth.getCurrentUser()) || {};
      const nextMap = {};

      attachment.attachments.forEach((nestedAttachment, index) => {
        if (!nestedAttachment?.audio_url) return;
        const sourceUrl = host + nestedAttachment.audio_url;
        if (userId && authToken) {
          const separator = sourceUrl.includes('?') ? '&' : '?';
          nextMap[index] = `${sourceUrl}${separator}rc_uid=${encodeURIComponent(userId)}&rc_token=${encodeURIComponent(authToken)}`;
        } else {
          nextMap[index] = sourceUrl;
        }
      });

      if (isMounted) {
        setNestedAudioSrcMap(nextMap);
      }
    };

    loadNestedAudio();

    return () => {
      isMounted = false;
    };
  }, [RCInstance, attachment?.attachments, host]);

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
            @media (max-width: 450px) {
              margin-top: 0.4rem;
            }
          `}
        >
          <AttachmentMetadata
            attachment={attachment}
            url={host + (attachment.audio_url || attachment.title_url)}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        </Box>
        {isExpanded && (
          <audio
            src={audioSrc || host + attachment.audio_url}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
            controls
          />
        )}

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
                <AttachmentMetadata
                  attachment={nestedAttachment}
                  url={
                    host +
                    (nestedAttachment.audio_url || nestedAttachment.title_url)
                  }
                  variantStyles={variantStyles}
                />
                <audio
                  src={
                    nestedAudioSrcMap[index] || host + nestedAttachment.audio_url
                  }
                  width="100%"
                  controls
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
