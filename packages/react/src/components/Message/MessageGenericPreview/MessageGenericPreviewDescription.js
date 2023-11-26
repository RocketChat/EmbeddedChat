// MessageGenericPreviewDescription.js
import React from 'react';

const MessageGenericPreviewDescription = ({ children, clamp = false }) => (
  <div
    className={[
      'rcx-message-generic-preview__description',
      clamp && 'rcx-message-generic-preview__description--clamp',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

export default MessageGenericPreviewDescription;
