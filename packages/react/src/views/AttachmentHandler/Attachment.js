import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon } from '@embeddedchat/ui-elements';
import ImageAttachment from './ImageAttachment';
import AudioAttachment from './AudioAttachment';
import VideoAttachment from './VideoAttachment';
import TextAttachment from './TextAttachment';
import { useUserStore } from '../../store';

const Attachment = ({ attachment, host, type, variantStyles = {} }) => {
  const { username } = useUserStore((state) => ({
    username: state.username,
  }));
  if (attachment && attachment.audio_url) {
    return (
      <AudioAttachment
        attachment={attachment}
        host={host}
        variantStyles={variantStyles}
      />
    );
  }
  if (attachment && attachment.video_url) {
    return (
      <VideoAttachment
        attachment={attachment}
        host={host}
        variantStyles={variantStyles}
      />
    );
  }
  if (attachment && attachment.image_url) {
    return (
      <ImageAttachment
        attachment={attachment}
        host={host}
        variantStyles={variantStyles}
      />
    );
  }
  if (attachment && attachment.text) {
    return (
      <TextAttachment
        attachment={attachment}
        type={type}
        variantStyles={variantStyles}
      />
    );
  }
  const parseMentions = (msg) => {
    const mentionRegex = /(@\w+)/g;
    const parts = msg.split(mentionRegex);
    return parts;
  };
  const parts = parseMentions(attachment.description);

  return (
    <Box
      css={css`
        display: flex;
      `}
    >
      <div>
        {parts.map((part, index) =>
          part.startsWith('@') ? (
            part.slice(1) !== username ? (
              <span
                key={index}
                css={css`
                  color: #71717a;
                  font-weight: bold;
                  background-color: #f4f4f5;
                  padding: 1.5px;
                  border-radius: 3px;
                `}
              >
                {part.slice(1)}
              </span>
            ) : (
              <span
                key={index}
                css={css`
                  color: #fafafa;
                  font-weight: bold;
                  background-color: #ef4444;
                  padding: 1.5px;
                  border-radius: 3px;
                `}
              >
                {part.slice(1)}
              </span>
            )
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
      <Icon name="file" size="20px" />
      <a href={`${host}${attachment.title_link}`}>{attachment.title}</a>
    </Box>
  );
};

export default Attachment;

Attachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
