import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import AttachmentMetadata from './AttachmentMetadata';
import { Button } from '../Button';
import ImageGallery from './ImageGallery';

const ImageAttachment = ({ attachment, host }) => {
  const [showGallery, setShowGallery] = useState(false);

  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  return (
    <Box>
      <AttachmentMetadata
        attachment={attachment}
        url={host + attachment.title_link}
      />
      <Button ghost onClick={() => setShowGallery(true)}>
        <img
          src={host + attachment.image_url}
          style={{ maxWidth: '100%', objectFit: 'contain' }}
        />
      </Button>
      {showGallery && (
        <ImageGallery
          currentFileId={extractIdFromUrl(attachment.title_link)}
          setShowGallery={setShowGallery}
        />
      )}
    </Box>
  );
};

export default ImageAttachment;

ImageAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
