import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../Box';

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
