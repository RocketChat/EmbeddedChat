import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../../Box';

function PreviewImage({ previewURL }) {
  return (
    <Box>
      <img
        src={previewURL}
        style={{ maxWidth: '100%', objectFit: 'contain' }}
      />
    </Box>
  );
}

export default PreviewImage;

PreviewImage.propTypes = {
  previewURL: PropTypes.string,
};
