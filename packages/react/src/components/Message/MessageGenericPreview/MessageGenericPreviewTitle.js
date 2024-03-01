// MessageGenericPreviewTitle.js
import React from 'react';

const MessageGenericPreviewTitle = ({ externalUrl, ...props }) =>
  externalUrl ? (
    <a
      className="rcx-message-generic-preview__title"
      href={externalUrl}
      target="_blank"
      {...props}
    />
  ) : (
    <span className="rcx-message-generic-preview__title" {...props} />
  );

export default MessageGenericPreviewTitle;
