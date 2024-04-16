import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import PinnedAttachment from './PinnedAttachment';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import RCContext from '../../context/RCInstance';
import { Button } from '../Button';
import ImageGallery from './ImageGallery';
import AttachmentMetadata from './AttachmentMetadata';
import { LinkPreview } from '../LinkPreview';

const Attachment = ({ attachment, host }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };

  if (attachment && attachment.audio_url) {
    return <AudioAttachment attachment={attachment} host={host} />;
  }
  if (attachment && attachment.video_url) {
    return <VideoAttachment attachment={attachment} host={host} />;
  }
  if (attachment && attachment.image_url) {
    return <ImageAttachment attachment={attachment} host={host} />;
  }
  if (attachment && attachment.text) {
    return <PinnedAttachment attachment={attachment} />;
  }
  
  if(attachment.attachments[0]){
    if (attachment.attachments[0].audio_url) {
      return <AudioAttachment attachment={attachment.attachments[0]} host={host} />;
    }
    if (attachment.attachments[0].video_url) {
      return  <VideoAttachment attachment={attachment.attachments[0]} host={host} />;
    }
    if (attachment.attachments[0].image_url) {
      return <ImageAttachment attachment={attachment.attachments[0]} host={host} />;
    }      
  }

  return (
    <Box>
      <p>{attachment?.description}</p>
      <Box
        style={{
          borderInlineStart: '1px solid currentColor',
          paddingLeft: '0.8rem',
        }}
      >
        <Box
          style={{
            display: 'flex',
            gap: '0.3rem',
          }}
        >
          <Avatar
            url={getUserAvatarUrl(attachment?.author_icon)}
            alt="avatar"
            size="1.2em"
          />
          <Box>{attachment?.author_name}</Box>
        </Box>
        <Box
          style={{
            marginTop: '0.7rem',
          }}
        >
          <Box>
            <Icon name="file" size="20px" />
            <a href={`${host}${attachment.title_link}`}>{attachment.title}</a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Attachment;

Attachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
