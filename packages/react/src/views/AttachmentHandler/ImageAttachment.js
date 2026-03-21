import React, { useState, useContext, useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';
import RCContext from '../../context/RCInstance';

const ImageAttachment = ({
  attachment,
  host,
  type,
  author,
  variantStyles = {},
  msg,
}) => {
  const { RCInstance } = useContext(RCContext);
  const [showGallery, setShowGallery] = useState(false);
  const [authParams, setAuthParams] = useState(null);

  useEffect(() => {
    let cancelled = false;
    RCInstance.auth.getCurrentUser().then((user) => {
      if (!cancelled) {
        setAuthParams(
          user?.authToken && user?.userId
            ? `rc_token=${user.authToken}&rc_uid=${user.userId}`
            : ''
        );
      }
    }).catch(() => {
      if (!cancelled) setAuthParams('');
    });
    return () => { cancelled = true; };
  }, [RCInstance]);

  const withAuth = (url) => {
    if (!url) return url;
    // Only add auth to URLs served from our own RC host — never leak creds to 3rd parties
    try {
      const rcHostname = new URL(host).hostname;
      if (new URL(url).hostname !== rcHostname) return url;
    } catch {
      return url; // malformed URL — skip auth
    }
    if (!authParams) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${authParams}`;
  };

  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  const { theme } = useTheme();

  const { authorIcon, authorName } = author;

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <Box css={variantStyles.imageAttachmentContainer}>
      <Box
        css={[
          css`
            cursor: pointer;
            border-radius: inherit;
            line-height: 0;
            padding: 0.5rem;
          `,
          (type ? variantStyles.pinnedContainer : '') ||
            css`
              ${type === 'file'
                ? `border: 2px solid ${theme.colors.border};`
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
            align-items: center;
            @media (max-width: 450px) {
              margin-top: 0.4rem;
            }
          `}
        >
          <AttachmentMetadata
            attachment={attachment}
            url={host + (attachment.title_link || attachment.image_url)}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        </Box>
        {isExpanded && (
          <Box onClick={() => setShowGallery(true)}>
            <img
              src={withAuth(host + attachment.image_url)}
              style={{
                maxWidth: '100%',
                objectFit: 'contain',
                borderBottomLeftRadius: 'inherit',
                borderBottomRightRadius: 'inherit',
              }}
            />
          </Box>
        )}
        {attachment.attachments &&
          attachment.attachments.map((nestedAttachment, index) => (
            <Box css={variantStyles.imageAttachmentContainer} key={index}>
              <Box
                onClick={() => setShowGallery(true)}
                css={[
                  css`
                    cursor: pointer;
                    border-radius: inherit;
                    line-height: 0;
                    padding: 0.5rem;
                  `,
                  (nestedAttachment.attachments[0].type
                    ? variantStyles.pinnedContainer
                    : variantStyles.quoteContainer) ||
                    css`
                      ${nestedAttachment.attachments[0].type === 'file'
                        ? `border: 2px solid ${theme.colors.border};`
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
                    (nestedAttachment.title_link || nestedAttachment.image_url)
                  }
                  variantStyles={variantStyles}
                />
                <img
                  src={withAuth(host + nestedAttachment.image_url)}
                  style={{
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderBottomLeftRadius: 'inherit',
                    borderBottomRightRadius: 'inherit',
                  }}
                />
              </Box>
              {showGallery && (
                <ImageGallery
                  currentFileId={extractIdFromUrl(nestedAttachment.title_link)}
                  setShowGallery={setShowGallery}
                />
              )}
            </Box>
          ))}
      </Box>
      {showGallery && (
        <ImageGallery
          currentFileId={extractIdFromUrl(attachment.title_link)}
          setShowGallery={setShowGallery}
        />
      )}
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
