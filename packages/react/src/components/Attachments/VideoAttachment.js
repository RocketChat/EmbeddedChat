import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import AttachmentMetadata from './AttachmentMetadata';

const VideoAttachment = ({ attachment, host }) => {
  return (
    <Box>
      <AttachmentMetadata
        attachment={attachment}
        url={host + attachment.video_url}
      />
      <video width={300} controls>
        <source
          src={host + attachment.video_url}
          type={attachment.video_type}
        />
      </video>
    </Box>
  );
};

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
