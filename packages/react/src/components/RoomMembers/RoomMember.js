import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Icon, ActionButton, Button } from '@rocket.chat/fuselage';
import RoomMemberItem from './RoomMemberItem';
import classes from './RoomMember.module.css';
import { useMemberStore } from '../../store';
import RCContext from '../../context/RCInstance';
import useInviteStore from '../../store/inviteStore';
import InviteMembers from './inviteMembers/InviteMembers';

const RoomMembers = ({ members }) => {
  const { RCInstance } = useContext(RCContext);

  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const showInvite = useInviteStore((state) => state.showInvite);

  const [inviteData, setInviteData] = useState(null);

  if (showInvite) return <InviteMembers inviteData={inviteData} />;

  return (
    <Box className={classes.modal} p="x16">
      <Box display="flex" is="h3">
        <Icon name="members" size="x24" padding="0px 20px 20px 0px" />
        <Box width="80%" style={{ color: '#4a4a4a' }}>
          Members
        </Box>
        <ActionButton
          onClick={toggleShowMembers}
          ghost
          display="inline"
          square
          small
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Box>
      <Box className={classes.container}>
        {members.map((member) => (
          <RoomMemberItem user={member} key={member._id} />
        ))}
      </Box>
      <Button
        style={{ marginTop: '10px', width: '100%' }}
        onClick={async () => {
          const res = await RCInstance.findOrCreateInvite();
          setInviteData(res);
          toggleInviteView();
        }}
      >
        <Icon size={18} name="link" /> Invite Link
      </Button>
    </Box>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
