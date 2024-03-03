import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import classes from '../RoomMember.module.css';
import useInviteStore from '../../../store/inviteStore';
import { Box } from '../../Box';
import { Icon } from '../../Icon';
import { Input } from '../../Input';
import { ActionButton } from '../../ActionButton';

const InviteMembers = ({ inviteData }) => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
  };

  return (
    <Box style={{ padding: '16px' }} className={classes.modal}>
      <Box
        css={css`
          display: flex;
          margin-bottom: 20px;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Box style={{ paddingRight: '20px' }}>
            <ActionButton onClick={() => toggleInviteView()} ghost size="small">
              <Icon name="back" size="1.25rem" />
            </ActionButton>
          </Box>
          <Box
            css={css`
              width: 80%;
              color: #4a4a4a;
            `}
          >
            Invite Members
          </Box>
        </h3>
      </Box>
      <Box
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 5px;
        `}
      >
        <Box style={{ marginBottom: '5px', alignSelf: 'start' }}>
          <span>Invite Link</span>
        </Box>
        <Box
          css={css`
            display: block;
            position: relative;
            align-items: center;
            width: 100%;
          `}
        >
          <Input
            readOnly
            value={inviteData.url}
            css={css`
              width: 100%;
              padding: 10px;
              padding-right: 40px;
              box-sizing: border-box;
            `}
          />
          <ActionButton
            onClick={() => copyToClipboard(inviteData.url)}
            ghost
            size="small"
            css={css`
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              padding: 0;
            `}
          >
            <Icon name={isCopied ? 'check' : 'clipboard'} size="1.25rem" />
          </ActionButton>
        </Box>
      </Box>
      <span style={{ color: 'grey', fontSize: '13px', fontWeight: '800' }}>
        Your invite link will expire on{' '}
        {new Date(inviteData.expires).toString().split('GMT')[0]}
      </span>
    </Box>
  );
};

export default InviteMembers;

InviteMembers.propTypes = {
  inviteData: PropTypes.object,
};
