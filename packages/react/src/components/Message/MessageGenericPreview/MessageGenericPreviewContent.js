// MessageGenericPreviewContent.js
import React from 'react';

const MessageGenericPreviewContent = ({ thumb, ...props }) => (
  <div className="rcx-message-generic-preview__content">
    {thumb}
    <div className="rcx-message-generic-preview__content-wrapper" {...props} />
  </div>
);

export default MessageGenericPreviewContent;
