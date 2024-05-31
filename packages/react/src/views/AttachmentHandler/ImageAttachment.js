import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import AttachmentMetadata from './AttachmentMetadata';
import ImageGallery from '../ImageGallery/ImageGallery';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const ImageAttachment = ({ attachment, host, variant }) => {
  const [showGallery, setShowGallery] = useState(false);
  const { colors } = useCustomTheme();
  const extractIdFromUrl = (url) => {
    const match = url.match(/\/file-upload\/(.*?)\//);
    return match ? match[1] : null;
  };

  return (
    <Box
      css={
        variant === 'bubble' &&
        css`
          border: 1px solid ${colors.border};
          border-radius: inherit;
          overflow: hidden;
        `
      }
    >
      <AttachmentMetadata
        attachment={attachment}
        url={host + (attachment.title_link || attachment.image_url)}
        variant={variant}
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
