import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const ImageAttachment = ({ attachment, host }) => {
  const [showGallery, setShowGallery] = useState(false);
  const { theme } = useCustomTheme();

  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  return (
    <Box>
      <AttachmentMetadata
        attachment={attachment}
        url={host + (attachment.title_link || attachment.image_url)}
      />
      <Box
        onClick={() => setShowGallery(true)}
        css={css`
          cursor: pointer;
          border-radius: ${theme.schemes.radius};
          width: 40%;
        `}
      >
        <img
          src={host + attachment.image_url}
          style={{
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: theme.schemes.radius,
          }}
        />
      </Box>
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
