import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon } from '@embeddedchat/ui-elements';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import TextAttachment from './TextAttachment';

const Attachment = ({ attachment, host, type, variantStyles = {}, msg }) => {
  const author = {
    authorIcon: attachment?.author_icon,
    authorName: attachment?.author_name,
  };
  if (attachment && attachment.audio_url) {
    return (
      <AudioAttachment
        attachment={attachment}
        host={host}
        author={author}
        variantStyles={variantStyles}
        msg={msg}
      />
    );
  }
  if (attachment && attachment.video_url) {
    return (
      <VideoAttachment
        attachment={attachment}
        host={host}
        author={author}
        variantStyles={variantStyles}
        msg={msg}
      />
    );
  }
  if (attachment && (attachment.image_url || attachment.title_link)) {
    console.log('Attachment Data:', {
      attachment,
      host,
      type
    });

    // Check if it's a GIF by checking the URL or title_link
    const url = attachment.image_url || attachment.title_link;
    console.log('Processing URL:', url);

    const isGif = url && (
      url.toLowerCase().endsWith('.gif') || 
      (attachment.image_type && attachment.image_type.toLowerCase() === 'image/gif') ||
      (attachment.description && attachment.description.toLowerCase().includes('gif'))
    );

    console.log('Is GIF:', isGif);

    // Ensure we have a complete URL
    const imageUrl = url.startsWith('http') ? url : (host + url);
    console.log('Final Image URL:', imageUrl);

    // Check if the URL has a file-upload path
    if (url && url.includes('/file-upload/')) {
      // For file uploads, always prepend host if not already present
      const fullUrl = url.startsWith('http') ? url : `${host}/file-upload/${url.split('/file-upload/')[1]}`;
      console.log('File Upload URL:', fullUrl);
      
      return (
        <ImageAttachment
          attachment={{
            ...attachment,
            image_url: fullUrl
          }}
          host={host}
          author={author}
          variantStyles={variantStyles}
          msg={msg}
          isGif={isGif}
        />
      );
    }

    return (
      <ImageAttachment
        attachment={{
          ...attachment,
          image_url: imageUrl
        }}
        host={host}
        author={author}
        variantStyles={variantStyles}
        msg={msg}
        isGif={isGif}
      />
    );
  }
  if (attachment && attachment.text) {
    return (
      <TextAttachment
        attachment={attachment}
        type={type}
        author={author}
        variantStyles={variantStyles}
      />
    );
  }
  if (
    attachment.attachments &&
    Array.isArray(attachment.attachments) &&
    attachment.attachments[0]?.image_url
  ) {
    return (
      <ImageAttachment
        attachment={attachment.attachments[0]}
        host={host}
        type={attachment.attachments[0].type}
        variantStyles={variantStyles}
        author={author}
      />
    );
  }
  if (
    attachment.attachments &&
    Array.isArray(attachment.attachments) &&
    attachment.attachments[0]?.audio_url
  ) {
    return (
      <AudioAttachment
        attachment={attachment.attachments[0]}
        host={host}
        type={attachment.attachments[0].type}
        variantStyles={variantStyles}
        author={author}
      />
    );
  }
  if (
    attachment.attachments &&
    Array.isArray(attachment.attachments) &&
    attachment.attachments[0]?.video_url
  ) {
    return (
      <VideoAttachment
        attachment={attachment.attachments[0]}
        host={host}
        type={attachment.attachments[0].type}
        variantStyles={variantStyles}
        author={author}
      />
    );
  }
  return (
    <Box
      css={css`
        display: flex;
      `}
    >
      {attachment?.description}

      <Icon name="file" size="20px" />
      <a href={`${host}${attachment.title_link}`}>{attachment.title}</a>
    </Box>
  );
};

export default Attachment;

Attachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
