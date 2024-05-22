import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RoomMemberItem from './RoomMemberItem';
import { useMemberStore } from '../../store';
import RCContext, { useRCContext } from '../../context/RCInstance';
import useInviteStore from '../../store/inviteStore';
import InviteMembers from './InviteMembers';
import { Button } from '../../components/Button';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useRoomMemberStyles } from './RoomMembers.styles';

const RoomMembers = ({ members }) => {
  const { RCInstance } = useContext(RCContext);
  const { ECOptions } = useRCContext();
  const { host } = ECOptions;
  const styles = useRoomMemberStyles();

  const setShowMembers = useMemberStore((state) => state.setShowMembers);
  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const showInvite = useInviteStore((state) => state.showInvite);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await RCInstance.me();
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

  return (
    <Sidebar title="Members" iconName="members" setShowWindow={setShowMembers}>
      <Box css={styles.container}>
        {showInvite ? (
          <InviteMembers inviteData={inviteData} />
        ) : (
          <>
            {members.map((member) => (
              <RoomMemberItem user={member} host={host} key={member._id} />
            ))}

            {isAdmin && (
              <Button
                style={{ marginTop: '10px', width: '100%' }}
                onClick={async () => {
                  const res = await RCInstance.findOrCreateInvite();
                  setInviteData(res);
                  toggleInviteView();
                }}
              >
                <Icon size="1em" name="link" /> Invite Link
              </Button>
            )}
          </>
        )}
      </Box>
    </Sidebar>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
