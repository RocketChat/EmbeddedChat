import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import AttachmentMetadata from './AttachmentMetadata';

const ImageAttachment = ({ attachment, host }) => {
  return (
    <Box>
      <AttachmentMetadata
        attachment={attachment}
        url={host + attachment.image_url}
      />
      <img
        src={host + attachment.image_url}
        style={{ maxWidth: '100%', objectFit: 'contain' }}
      />
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
