import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import { Avatar } from '../Avatar';
import RCContext from '../../context/RCInstance';

const PinnedAttachment = ({ attachment }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (authorIcon) => {
    const host = RCInstance.getHost();
    const URL = `${host}${authorIcon}`;
    return URL;
  };
  return (
    <Box
      style={{
        borderInlineStart: '1px solid currentColor',
        paddingLeft: '0.8rem'
      }}
    >
      <Box style={{
        display: 'flex',
        gap: '0.5rem',
      }}>
        <Avatar
          url={getUserAvatarUrl(attachment?.author_icon)}
          alt="avatar"
          size={'1.2em'}
        />
        <Box>{attachment?.author_name}</Box>
      </Box>
      <Box>{attachment?.text}</Box>
    </Box>)
}


export default PinnedAttachment;

PinnedAttachment.propTypes = {
  attachment: PropTypes.object,
};
