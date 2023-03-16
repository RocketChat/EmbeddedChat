import React from 'react';
import { Box } from '@rocket.chat/fuselage';
import PropType from 'prop-types';
import { sanitizeUrl } from '@braintree/sanitize-url';

const UrlDescription = ({ url }) => {
  const description =
    url &&
    url.meta &&
    (url.meta.oembedAuthorName ||
      url.meta.ogDescription ||
      url.meta.description);
  if (!description) return null;
  return (
    <Box
      display="flex"
      flexDirection="row"
      color="hint"
      fontScale="c1"
      alignItems="center"
      width="100%"
      padding="0.25rem 0.5rem"
      style={{
        wordBreak: 'break-word',
      }}
    >
      {url.meta.oembedAuthorUrl && url.meta.oembedAuthorName ? (
        <a
          href={sanitizeUrl(url.meta.oembedAuthorUrl)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {description.length >= 150
            ? `${description.slice(0, 147)}...`
            : description}
        </a>
      ) : (
        <span>
          {description.length >= 150
            ? `${description.slice(0, 147)}...`
            : description}
        </span>
      )}
    </Box>
  );
};

export default UrlDescription;

UrlDescription.propTypes = {
  url: PropType.object,
};
