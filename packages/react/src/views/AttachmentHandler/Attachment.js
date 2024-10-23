import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon } from '@embeddedchat/ui-elements';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import TextAttachment from './TextAttachment';

const Attachment = ({ attachment, host, type, variantStyles = {} }) => {
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
      />
    );
  }
  if (attachment && attachment.image_url) {
    return (
      <ImageAttachment
        attachment={attachment}
        host={host}
        author={author}
        variantStyles={variantStyles}
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
  if (attachment && attachment.attachments[0]?.image_url) {
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
  if (attachment && attachment.attachments[0]?.audio_url) {
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
  if (attachment && attachment.attachments[0]?.video_url) {
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
