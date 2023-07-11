import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

const VideoAttachment = ({ attachment, host }) => (
  <Box>
    <p>{attachment?.description}</p>
    <video width={300} controls>
      <source src={host + attachment.video_url} type={attachment.video_type} />
    </video>
  </Box>
);

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
