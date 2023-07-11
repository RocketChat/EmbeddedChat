import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../../Box';

function PreviewImage({ previewURL }) {
  return (
    <Box>
      <img
        src={previewURL}
        height={357}
        width={476}
        style={{ maxWidth: '100%', objectFit: 'contain' }}
      />
    </Box>
  );
}

export default PreviewImage;

PreviewImage.propTypes = {
  previewURL: PropTypes.string,
};
