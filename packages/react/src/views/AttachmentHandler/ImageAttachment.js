import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';
import RCContext from '../../context/RCInstance';
import useAuthenticatedMediaUrl from '../../hooks/useAuthenticatedMediaUrl';

const NestedImageAttachment = ({
  nestedAttachment,
  host,
  variantStyles = {},
  theme,
  getUserAvatarUrl,
  extractIdFromUrl,
  setShowGallery,
  showGallery,
}) => {
  const mediaUrl = useAuthenticatedMediaUrl(nestedAttachment.image_url, host);
  const titleUrl = useAuthenticatedMediaUrl(
    nestedAttachment.title_link || nestedAttachment.image_url,
    host
  );

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
          (nestedAttachment.attachments?.[0]?.type
            ? variantStyles.pinnedContainer
            : variantStyles.quoteContainer) ||
            css`
              ${nestedAttachment.attachments?.[0]?.type === 'file'
                ? `border: 2px solid ${theme.colors.border};`
                : ''}
            `,
        ]}
      >
        {nestedAttachment.type === 'file' ? (
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
        ) : (
          ''
        )}
        <AttachmentMetadata
          attachment={nestedAttachment}
          url={titleUrl || mediaUrl}
          variantStyles={variantStyles}
        />
        <img
          src={mediaUrl}
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
  );
};

NestedImageAttachment.propTypes = {
  nestedAttachment: PropTypes.object,
  host: PropTypes.string,
  variantStyles: PropTypes.object,
  theme: PropTypes.object,
  getUserAvatarUrl: PropTypes.func,
  extractIdFromUrl: PropTypes.func,
  setShowGallery: PropTypes.func,
  showGallery: PropTypes.bool,
};

const ImageAttachment = ({
  attachment,
  host,
  type,
  author = {},
  variantStyles = {},
  msg,
}) => {
  const { RCInstance } = useContext(RCContext);
  const [showGallery, setShowGallery] = useState(false);
  const getUserAvatarUrl = (icon) => {
    const instanceHost = RCInstance.getHost();
    const URL = `${instanceHost}${icon}`;
    return URL;
  };
  const extractIdFromUrl = (url) => {
    const match = url?.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  const { theme } = useTheme();

  const { authorIcon, authorName } = author;

  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpanded = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const mediaUrl = useAuthenticatedMediaUrl(attachment.image_url, host);
  const titleUrl = useAuthenticatedMediaUrl(
    attachment.title_link || attachment.image_url,
    host
  );

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
            url={titleUrl || mediaUrl}
            variantStyles={variantStyles}
            msg={msg}
            onExpandCollapseClick={toggleExpanded}
            isExpanded={isExpanded}
          />
        </Box>
        {isExpanded && (
          <Box onClick={() => setShowGallery(true)}>
            <img
              src={mediaUrl}
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
            <NestedImageAttachment
              key={index}
              nestedAttachment={nestedAttachment}
              host={host}
              variantStyles={variantStyles}
              theme={theme}
              getUserAvatarUrl={getUserAvatarUrl}
              extractIdFromUrl={extractIdFromUrl}
              setShowGallery={setShowGallery}
              showGallery={showGallery}
            />
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
  type: PropTypes.string,
  author: PropTypes.object,
  variantStyles: PropTypes.object,
  msg: PropTypes.object,
};
