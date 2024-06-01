import React from 'react';
import PropTypes from 'prop-types';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import PinnedAttachment from './PinnedAttachment';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';

const Attachment = ({ attachment, host }) => {
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
  return (
    <Box>
      <p>{attachment?.description}</p>
      <p>
        <Icon name="file" size="20px" />
        <a href={`${host}${attachment.title_link}`}>{attachment.title}</a>
      </p>
    </Box>
  );
};

export default Attachment;

Attachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
