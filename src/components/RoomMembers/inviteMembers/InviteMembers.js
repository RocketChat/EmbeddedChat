import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Icon, ActionButton, Input, Label } from '@rocket.chat/fuselage';
import classes from '../RoomMember.module.css';
import useInviteStore from '../../../store/inviteStore';

const InviteMembers = ({ inviteData }) => {
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);

  return (
    <Box className={classes.modal} p="x16">
      <Box display="flex" is="h3">
        <Icon name="link" size="x24" padding="0px 20px 20px 0px" />
        <Box width="80%" style={{ color: '#4a4a4a' }}>
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
      </Box>
      <Box width="100%" flexDirection="column" display="flex">
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
