import React, { useState } from 'react';

const AuthenticatedImage = ({ url, alt, ...props }) => {
  const [hasError, setHasError] = useState(false);

  if (!url) return null;

  // The proxy endpoint established in Storybook middleware.
  // In a real application, the host would provide their own media proxy URL.
  const proxyUrl = `/api/proxy-media?url=${encodeURIComponent(url)}`;

  if (hasError) return null;

  return (
    <img
      src={proxyUrl}
      alt={alt}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default AuthenticatedImage;
