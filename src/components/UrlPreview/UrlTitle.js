import React from 'react';
import { Box } from '@rocket.chat/fuselage';
import PropType from 'prop-types';
import { sanitizeUrl } from '@braintree/sanitize-url';

const UrlTitle = ({ url }) => {
  const title =
    url &&
    url.meta &&
    (url.meta.oembedTitle || url.meta.ogTitle || url.meta.pageTitle);
  if (!title) return null;
  return (
    <Box
      display="flex"
      flexDirection="row"
      color="hint"
      fontScale="h5"
      alignItems="center"
      width="100%"
      padding="0.25rem 0.5rem"
      style={{
        wordBreak: 'break-word',
      }}
    >
      <a href={sanitizeUrl(url.url)} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </Box>
  );
};

export default UrlTitle;

UrlTitle.propTypes = {
  url: PropType.object,
};
