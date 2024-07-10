import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Avatar, useTheme } from '@embeddedchat/ui-elements';
import AttachmentMetadata from './AttachmentMetadata';
import RCContext from '../../context/RCInstance';

const AudioAttachment = ({
  attachment,
  host,
  type,
  authorIcon,
  authorName,
  variantStyles,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { colors } = useTheme();
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };
  return (
    <Box>
      <Box
        css={[
          css`
            line-height: 0;
            border-radius: inherit;
            padding: 0.5rem;
          `,
          (type
            ? variantStyles.pinnedContainer
            : variantStyles.quoteContainer) ||
            css`
              ${type === 'file' ? `border: 3px solid ${colors.border};` : ''}
            `,
        ]}
      >
        {type === 'file' ? (
          <>
            <Box
              css={[
                css`
                  display: flex;
                  gap: 0.3rem;
                  align-items: center;
                `,
                variantStyles.textUserInfo,
              ]}
            >
              <Avatar
                url={getUserAvatarUrl(authorIcon)}
                alt="avatar"
                size="1.2em"
              />
              <Box>@{authorName}</Box>
            </Box>
          </>
        ) : (
          ''
        )}
        <AttachmentMetadata
          attachment={attachment}
          url={host + (attachment.title_url || attachment.audio_url)}
          variantStyles={variantStyles}
        />
        <audio src={host + attachment.audio_url} width="100%" controls />
      </Box>
    </Box>
  );
};

export default AudioAttachment;

AudioAttachment.propTypes = {
  attachment: PropTypes.object,
  host: PropTypes.string,
};
