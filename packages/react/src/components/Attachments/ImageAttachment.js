import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

const ImageAttachment = ({ attachment, host }) => (
  <Box>
    <p>{attachment?.description}</p>
    <img
      src={host + attachment.image_url}
      style={{ maxWidth: '100%', objectFit: 'contain' }}
    />
  </Box>
);

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
