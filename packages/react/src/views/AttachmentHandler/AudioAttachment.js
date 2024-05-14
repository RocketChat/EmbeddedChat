import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import AttachmentMetadata from './AttachmentMetadata';

const AudioAttachment = ({ attachment, host }) => (
  <Box>
    <AttachmentMetadata
      attachment={attachment}
      url={host + (attachment.title_url || attachment.audio_url)}
    />
    <audio src={host + attachment.audio_url} width="100%" controls />
  </Box>
);

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
