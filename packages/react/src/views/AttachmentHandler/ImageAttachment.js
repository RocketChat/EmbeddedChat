import React, { useState, useContext } from 'react';
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
  authorIcon,
  authorName,
  variantStyles = {},
}) => {
  const { RCInstance } = useContext(RCContext);
  const [showGallery, setShowGallery] = useState(false);
  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  const { colors } = useTheme();

  return (
    <Box css={variantStyles.imageAttachmentContainer}>
      <Box
        onClick={() => setShowGallery(true)}
        css={[
          css`
            cursor: pointer;
            border-radius: inherit;
            line-height: 0;
            padding: 0.5rem;
          `,
          (type
            ? variantStyles.pinnedContainer
            : variantStyles.quoteContainer) ||
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
          url={host + (attachment.title_link || attachment.image_url)}
          variantStyles={variantStyles}
        />
        <img
          src={host + attachment.image_url}
          style={{
            maxWidth: '100%',
            objectFit: 'contain',
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
          }}
        />
        {attachment.attachments ? (
          <Box css={variantStyles.imageAttachmentContainer}>
            <Box
              onClick={() => setShowGallery(true)}
              css={[
                css`
                  cursor: pointer;
                  border-radius: inherit;
                  line-height: 0;
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
                  (attachment.attachments[0].title_link ||
                    attachment.attachments[0].image_url)
                }
                variantStyles={variantStyles}
              />
              <img
                src={host + attachment.attachments[0].image_url}
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
                currentFileId={extractIdFromUrl(
                  attachment.attachments[0].title_link
                )}
                setShowGallery={setShowGallery}
              />
            )}
          </Box>
        ) : (
          <></>
        )}
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
