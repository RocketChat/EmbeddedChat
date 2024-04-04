import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import AttachmentMetadata from './AttachmentMetadata';
import { Button } from '../Button';
import ImageGallery from './ImageGallery';

const ImageAttachment = ({ attachment, host }) => {
  const [showSlider, setShowSlider] = useState(false);

  return (
    <Box>
      <AttachmentMetadata
        attachment={attachment}
        url={host + attachment.title_link}
      />
      <Button ghost onClick={() => setShowSlider(true)}>
        <img
          src={host + attachment.image_url}
          style={{ maxWidth: '100%', objectFit: 'contain' }}
        />
      </Button>
      {showSlider && <ImageGallery attachment={attachment} host={host} />}
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
