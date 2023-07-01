import React from 'react';
import { Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';

function PreviewAudio({ previewURL }) {
  return (
    <Box>
      <audio src={previewURL} width="100%" controls />
    </Box>
  );
}

export default PreviewAudio;

PreviewAudio.propTypes = {
  previewURL: PropTypes.string,
};
