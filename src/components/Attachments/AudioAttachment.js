import { Box } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';

const AudioAttachment = ({ attachment }) => {
  return (
    <Box>
      <p>{attachment?.description}</p>
      <audio
        src={'http://localhost:3000' + attachment.audio_url}
        width={'100%'}
        controls
      ></audio>
    </Box>
  );
};

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
};
