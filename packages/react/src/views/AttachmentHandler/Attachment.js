import React from 'react';
import PropTypes from 'prop-types';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import TextAttachment from './TextAttachment';
import FileAttachment from './FileAttachment';

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
  if (attachment && attachment.image_url) {
    return (
      <ImageAttachment
        attachment={attachment}
        host={host}
        author={author}
        variantStyles={variantStyles}
        msg={msg}
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
    <FileAttachment
      attachment={attachment}
      host={host}
      type="file"
      author={author}
      variantStyles={variantStyles}
      msg={msg}
    />
  );
};

export default Attachment;

Attachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
