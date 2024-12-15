import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Icon,
  Sidebar,
  Popup,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import RoomMemberItem from './RoomMemberItem';
import RCContext, { useRCContext } from '../../context/RCInstance';
import useInviteStore from '../../store/inviteStore';
import InviteMembers from './InviteMembers';
import { getRoomMemberStyles } from './RoomMembers.styles';
import LoadingIndicator from '../MessageAggregators/common/LoadingIndicator';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const RoomMembers = ({ members }) => {
  const { RCInstance } = useContext(RCContext);
  const { ECOptions } = useRCContext();
  const { host } = ECOptions;
  const { theme } = useTheme();
  const styles = getRoomMemberStyles(theme);

  const toggleInviteView = useInviteStore((state) => state.toggleInviteView);
  const showInvite = useInviteStore((state) => state.showInvite);
  const [isLoading, setIsLoading] = useState(true);
  const { variantOverrides } = useComponentOverrides('RoomMember');
  const viewType = variantOverrides.viewType || 'Sidebar';

  const [userInfo, setUserInfo] = useState(null);
  const setExclusiveState = useSetExclusiveState();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await RCInstance.me();
        setUserInfo(res);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, [RCInstance]);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;
  return (
    <ViewComponent
      title="Members"
      iconName="members"
      onClose={() => setExclusiveState(null)}
      {...(viewType === 'Popup'
        ? {
            isPopupHeader: true,
          }
        : {})}
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <Box css={styles.container}>
          {showInvite ? (
            <InviteMembers />
          ) : (
            <>
              {members.map((member) => (
                <RoomMemberItem user={member} host={host} key={member._id} />
              ))}

              {isAdmin && (
                <Button
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={async () => {
                    toggleInviteView();
                  }}
                >
                  <Icon size="1em" name="link" /> Invite Link
                </Button>
              )}
            </>
          )}
        </Box>
      )}
    </ViewComponent>
  );
};
export default RoomMembers;

RoomMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape),
};
