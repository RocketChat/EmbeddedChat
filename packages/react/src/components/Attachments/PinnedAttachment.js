import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import MessageEmoji from '../MessageEmoji/MessageEmoji'
import RCContext from '../../context/RCInstance';
import { Avatar } from '../Avatar';


const PinnedAttachment = ({ attachment }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  return (
    <Box
      style={{
        borderInlineStart: '1px solid currentColor',
      }}
    >
      <Box style={{paddingLeft: '0.8rem', paddingTop: '0.3rem'}}>
        <Avatar
          url={getUserAvatarUrl(attachment?.author_name)}
          alt="avatar"
          size={attachment?.text.t ? '1.2em' : '1.5em'}
        />&nbsp;&nbsp;<>{attachment?.author_name}</>
      </Box><br/>
      <Box style={{paddingLeft: '1rem', paddingBottom: '0.7rem'}}>{attachment?.text ? (
        <MessageEmoji body={attachment?.text} />
      ) : (
        attachment?.txt
      )}</Box>
    </Box>
  )
}

export default PinnedAttachment;

PinnedAttachment.propTypes = {
  attachment: PropTypes.object,
};
