import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

const AudioAttachment = ({ attachment, host }) => (
  <Box>
    <p>{attachment?.description}</p>
    <audio src={host + attachment.audio_url} width="100%" controls />
  </Box>
);

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
