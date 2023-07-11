import React from 'react';
import PropTypes from 'prop-types';
import { Box, Icon, ActionButton, Input, Label } from '@rocket.chat/fuselage';
import { css } from '@emotion/react';
import classes from '../RoomMember.module.css';
import useInviteStore from '../../../store/inviteStore';

const InviteMembers = ({ inviteData }) => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);

  return (
    <Box style={{ padding: '16px' }} className={classes.modal}>
      <Box
        css={css`
          display: flex;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Icon name="link" size="x24" padding="0px 20px 20px 0px" />
          <Box
            css={css`
              width: 80%;
              color: #4a4a4a;
            `}
          >
            Invite Members
          </Box>
          <ActionButton
            onClick={() => toggleInviteView()}
            ghost
            display="inline"
            square
            small
          >
            <Icon name="back" size="x20" />
          </ActionButton>
        </h3>
      </Box>
      <Box
        css={css`
          width: 100%;
          display: flex;
          flex-direction: column;
        `}
      >
        <Label>Invite Link</Label>
        <Input readOnly value={inviteData.url} />
      </Box>
      <Label>
        Your invite link will expire on{' '}
        {new Date(inviteData.expires).toString().split('GMT')[0]}
      </Label>
    </Box>
  );
};

export default InviteMembers;

InviteMembers.propTypes = {
  inviteData: PropTypes.object,
};
