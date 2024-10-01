import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';

const AudioAttachment = ({ attachment, host, variantStyles }) => (
  <Box>
    <AttachmentMetadata
      attachment={attachment}
      url={host + (attachment.title_url || attachment.audio_url)}
      variantStyles={variantStyles}
    />
    <audio src={host + attachment.audio_url} width="100%" controls />
  </Box>
);

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
