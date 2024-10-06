import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';

const userAgentMIMETypeFallback = (type) => {
  const userAgent = navigator.userAgent.toLocaleLowerCase();

  if (type === 'video/quicktime' && userAgent.indexOf('safari') !== -1) {
    return 'video/mp4';
  }

  return type;
};

const VideoAttachment = ({ attachment, host, variantStyles = {} }) => (
  <Box css={variantStyles.videoAttachmentContainer}>
    <AttachmentMetadata
      attachment={attachment}
      url={host + (attachment.title_url || attachment.video_url)}
      variantStyles={variantStyles}
    />
    <Box
      css={css`
        line-height: 0;
        border-radius: inherit;
      `}
    >
      <video
        width={300}
        controls
        style={{
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
        }}
      >
        <source
          src={host + attachment.video_url}
          type={userAgentMIMETypeFallback(attachment.video_type)}
        />
      </video>
    </Box>
  </Box>
);

export default VideoAttachment;

VideoAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
