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

  const [statusData, setStatusData] = useState({});
  const [viewStatus, setViewStatus] = useState('All');

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
    const fetchStatuses = async () => {
      const statusPromises = members.map(async (member) => {
        try {
          const res = await RCInstance.getUserStatus(member._id);
          if (res.success) {
            return { id: member._id, status: res.status };
          }
        } catch (err) {
          console.error('Error fetching user status:', err);
        }
        return { id: member._id, status: 'offline' };
      });

      const statuses = await Promise.all(statusPromises);

      const statusMap = statuses.reduce((acc, { id, status }) => {
        acc[id] = status;
        return acc;
      }, {});

      setStatusData(statusMap);
    };

    fetchStatuses();
  }, [members, RCInstance]);

  useEffect(() => {
    const filtered = members.filter((member) => {
      if (viewStatus === 'Online') {
        return statusData[member._id] === 'online';
      }
      return true;
    });

    setFilteredMembers(
      filtered.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [viewStatus, statusData, searchTerm, members]);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  const handleSelect = (value) => {
    setViewStatus(value);
  };

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
                <Button
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                  onClick={async () => {
                    toggleInviteView();
                  }}
                >
                  <Icon size="1em" name="link" /> Invite Link
                </Button>
              )}
              <Box
                css={css`
                  display: flex;
                `}
              >
                <Box css={styles.searchContainer}>
                  <Input
                    css={styles.textInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search members"
                  />
                  <Icon
                    name="magnifier"
                    size="1.5rem"
                    css={styles.searchIcon}
                  />
                </Box>
                <Box css={styles.filterContainer}>
                  <Box
                    css={css`
                      position: absolute;
                      z-index: 10;
                    `}
                  >
                    <StaticSelect
                      options={[
                        { value: 'All', label: 'All' },
                        { value: 'Online', label: 'Online' },
                      ]}
                      value={viewStatus}
                      onSelect={handleSelect}
                      placeholder={viewStatus}
                    />
                  </Box>
                </Box>
              </Box>
              <Box css={styles.memberList}>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <RoomMemberItem
                      user={member}
                      host={host}
                      userStatus={statusData[member._id]}
                      key={member._id}
                    />
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
