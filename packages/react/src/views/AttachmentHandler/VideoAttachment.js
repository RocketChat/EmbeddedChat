import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import AttachmentMetadata from './AttachmentMetadata';

const userAgentMIMETypeFallback = (type) => {
  const userAgent = navigator.userAgent.toLocaleLowerCase();

  if (type === 'video/quicktime' && userAgent.indexOf('safari') !== -1) {
    return 'video/mp4';
  }

  return type;
};

const VideoAttachment = ({ attachment, host }) => (
  <Box>
    <AttachmentMetadata
      attachment={attachment}
      url={host + (attachment.title_url || attachment.video_url)}
    />
    <video width={300} controls>
      <source
        src={host + attachment.video_url}
        type={userAgentMIMETypeFallback(attachment.video_type)}
      />
    </video>
  </Box>
);

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
