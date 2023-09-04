import React from 'react';
import { Box } from '@rocket.chat/fuselage';
import PropType from 'prop-types';
import { sanitizeUrl } from '@braintree/sanitize-url';

const UrlThumbnail = ({ url }) => {
  const thumbnailUrl =
    url && url.meta && (url.meta.oembedThumbnailUrl || url.meta.ogImage);

  if (!thumbnailUrl) return null;
  return (
    <Box width="100%">
      <a href={sanitizeUrl(url.url)} target="_blank" rel="noopener noreferrer">
        <img
          style={{
            height: 'auto',
            width: '100%',
          }}
          src={sanitizeUrl(thumbnailUrl)}
        />
      </a>
    </Box>
  );
};

export default UrlThumbnail;

UrlThumbnail.propTypes = {
  url: PropType.object,
};
