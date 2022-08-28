import { Box } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';

const ImageAttachment = ({ attachment }) => {
  return (
    <Box>
      <p>{attachment?.description}</p>
      <img
        src={'http://localhost:3000' + attachment.image_url}
        height={attachment.image_dimensions.height}
        width={attachment.image_dimensions.width}
      />
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
};
