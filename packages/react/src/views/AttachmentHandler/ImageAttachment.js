import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';

const ImageAttachment = ({ attachment, host, variantStyles = {} }) => {
  const [showGallery, setShowGallery] = useState(false);
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  return (
    <Box css={variantStyles.imageAttachmentContainer}>
      <AttachmentMetadata
        attachment={attachment}
        url={host + (attachment.title_link || attachment.image_url)}
        variantStyles={variantStyles}
      />
      <Box
        onClick={() => setShowGallery(true)}
        css={css`
          cursor: pointer;
          border-radius: inherit;
          line-height: 0;
        `}
      >
        <img
          src={host + attachment.image_url}
          style={{
            maxWidth: '100%',
            objectFit: 'contain',
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
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
