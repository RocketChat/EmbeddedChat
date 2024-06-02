import React, { useContext } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../../components/Box';
import { Avatar } from '../../components/Avatar';
import RCContext from '../../context/RCInstance';

const TextAttachment = ({ attachment }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };

  let attachmentText = attachment?.text;
  if (attachmentText.includes(')')) {
    attachmentText = attachmentText.split(')')[1] || '';
  }

  return (
    <Box
      css={css`
        border-inline-start: 1px solid currentColor;
        padding-left: 0.8rem;
      `}
    >
      <Box
        css={css`
          display: flex;
          gap: 0.3rem;
        `}
      >
        <Avatar
          url={getUserAvatarUrl(attachment?.author_icon)}
          alt="avatar"
          size="1.2em"
        />
        <Box>{attachment?.author_name}</Box>
      </Box>
      <Box
        css={css`
          margin-top: 0.7rem;
        `}
      >
        {attachmentText}
      </Box>
    </Box>
  );
};

export default TextAttachment;

TextAttachment.propTypes = {
  attachment: PropTypes.object,
};
