import React from 'react';
import PropTypes from 'prop-types';

const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // Allow relative URLs starting with / (but not protocol-relative //)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
};

const getLabelText = (label) => {
  if (!label) {
    return '';
  }
  if (typeof label === 'string') {
    return label;
  }
  if (Array.isArray(label)) {
    return label.map((item) => item?.value || '').join('');
  }
  return label.value || '';
};

const ImageElement = ({ src, label }) => {
  const safeSrc = sanitizeUrl(src);
  if (!safeSrc) {
    return null;
  }

  const alt = getLabelText(label);

  return (
    <a
      href={safeSrc}
      title={alt || safeSrc}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        src={safeSrc}
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          display: 'inline-block',
        }}
      />
    </a>
  );
};

export default ImageElement;

ImageElement.propTypes = {
  src: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};
