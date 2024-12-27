import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Icon,
  Sidebar,
  Input,
  Popup,
  StaticSelect,
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
import { css } from '@emotion/react';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  const [roleFilter, setRoleFilter] = useState('all');
  const [filteredMembersByRole, setFilteredMembersByRole] = useState(members);

  const [roleData, setRoleData] = useState({
    admin: [],
    all: [],
    leader: [],
    moderator: [],
    owner: [],
  });

  const fetchRoleData = async () => {
    try {
      const adminRes = await RCInstance.getUsersInRole('admin');
      const allRes = await RCInstance.getUsersInRole('user');
      const leaderRes = await RCInstance.getUsersInRole('leader');
      const moderatorRes = await RCInstance.getUsersInRole('moderator');
      const ownerRes = await RCInstance.getUsersInRole('owner');

      setRoleData({
        admin: adminRes.users || [],
        all: allRes.users || [],
        leader: leaderRes.users || [],
        moderator: moderatorRes.users || [],
        owner: ownerRes.users || [],
      });
    } catch (error) {
      console.error('Error fetching role data:', error);
    }
  };

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

  useEffect(() => {
    if (isAdmin) {
      fetchRoleData();
    }
  }, [RCInstance, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      setFilteredMembersByRole(roleData[roleFilter] || []);
    }
  }, [roleFilter, roleData, isAdmin]);

  useEffect(() => {
    setFilteredMembers(
      filteredMembersByRole.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, filteredMembersByRole]);

  return (
    <ViewComponent
      title="Members"
      iconName="members"
      onClose={() => setExclusiveState(null)}
      style={{ width: '400px', zIndex: window.innerWidth <= 780 ? 1 : null }}
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
              {isAdmin && (
                <>
                  <Button
                    style={{ marginTop: '10px', width: '100%' }}
                    onClick={async () => {
                      toggleInviteView();
                    }}
                  >
                    <Icon size="1em" name="link" /> Invite Link
                  </Button>

                  <Box css={styles.filterContainer}>
                    <Box
                      css={css`
                        position: absolute;
                        z-index: 10;
                      `}
                    >
                      <StaticSelect
                        options={[
                          { value: 'all', label: 'All' },
                          { value: 'admin', label: 'Admin' },
                          { value: 'owner', label: 'Owner' },
                          { value: 'moderator', label: 'Moderator' },
                          { value: 'leader', label: 'Leader' },
                        ]}
                        value={roleFilter}
                        onSelect={(value) => setRoleFilter(value)}
                        placeholder="Select Role"
                      />
                    </Box>
                  </Box>
                </>
              )}

              <Box css={styles.searchContainer}>
                <Input
                  css={styles.textInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members"
                />
                <Icon name="magnifier" size="1.5rem" css={styles.searchIcon} />
              </Box>

              <Box css={styles.memberList}>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <>
                      <RoomMemberItem
                        user={member}
                        host={host}
                        key={member._id}
                      />
                    </>
                  ))
                ) : (
                  <Box css={styles.noMembers}>No members found</Box>
                )}
              </Box>
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
