import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RoomMemberItem from './RoomMemberItem';
import classes from './RoomMember.module.css';
import { useMemberStore } from '../../store';
import RCContext, { useRCContext } from '../../context/RCInstance';
import useInviteStore from '../../store/inviteStore';
import InviteMembers from './inviteMembers/InviteMembers';
import { Button } from '../Button';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';

const RoomMembers = ({ members }) => {
  const { RCInstance } = useContext(RCContext);
  const { ECOptions } = useRCContext();
  const { host } = ECOptions;

  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const showInvite = useInviteStore((state) => state.showInvite);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await RCInstance.me();
        console.log(res);
        setUserInfo(res);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, [RCInstance]);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');


  const [inviteData, setInviteData] = useState(null);

  if (showInvite) return <InviteMembers inviteData={inviteData} />;

  return (
    <Box className={classes.modal} style={{ padding: '16px' }}>
      <Box style={{ display: 'flex' }}>
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="members"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box style={{ color: '#4a4a4a', width: '80%' }}>Members</Box>
          <ActionButton onClick={toggleShowMembers} ghost size="small">
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>
      <Box className={classes.container}>
        {members.map((member) => (
          <RoomMemberItem user={member} host={host} key={member._id} />
        ))}
      </Box>
      {isAdmin && (
        <Button
          style={{ marginTop: '10px', width: '100%' }}
          onClick={async () => {
            const res = await RCInstance.findOrCreateInvite();
            console.log(res);
            setInviteData(res);
            toggleInviteView();
          }}
        >
          <Icon size="1em" name="link" /> Invite Link
        </Button>
      )}
    </Box>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
