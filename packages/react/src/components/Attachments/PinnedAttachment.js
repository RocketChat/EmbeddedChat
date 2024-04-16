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
        padding: '0.4rem 0.8rem',
        backgroundColor: '#ebedf2',
        opacity: '0.9'
      }}
    >
      <Box
        style={{
          display: 'flex',
          gap: '0.1rem',
        }}
      >
        <Avatar
          url={getUserAvatarUrl(attachment?.author_icon)}
          alt="avatar"
          size="1.2em"
        />
        <Box>{attachment?.author_name}</Box>
      </Box>
      <Box
        style={{
          marginTop: '0.3rem',
        }}
      >
        {attachment?.text[0] == '['
          ? attachment?.text.match(/\n(.*)/)[1]
          : attachment?.text
        }

        {attachment.attachments[0] ? (
          <Box
            style={{
              borderInlineStart: '1px solid currentColor',
              padding: '0.4rem 0.8rem',
              backgroundColor: '#ebedf2',
              opacity: '0.9'
            }}
          >
            <Box
              style={{
                display: 'flex',
                gap: '0.1rem',
              }}
            >
              <Avatar
                url={getUserAvatarUrl(attachment.attachments[0]?.author_icon)}
                alt="avatar"
                size="1.2em"
              />
              <Box>{attachment.attachments[0]?.author_name}</Box>
            </Box>
            <Box
              style={{
                marginTop: '0.3rem',
              }}
            >
              {attachment.attachments[0]?.text[0] == '['
                ? attachment.attachments[0]?.text.match(/\n(.*)/)[1]
                : attachment.attachments[0]?.text
              }
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default PinnedAttachment;

PinnedAttachment.propTypes = {
  attachment: PropTypes.object,
};
