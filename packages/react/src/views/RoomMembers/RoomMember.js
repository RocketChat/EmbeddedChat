import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Icon,
  Sidebar,
  Input,
  Popup,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(members);

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
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, members]);

  const roles = userInfo && userInfo.roles ? userInfo.roles : [];
  const isAdmin = roles.includes('admin');
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title={i18n.t('Members')}
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
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={async () => {
                    toggleInviteView();
                  }}
                >
                  <Icon size="1em" name="link" />
                  {i18n.t('Invite_Link')}
                </Button>
              )}
              <Box css={styles.searchContainer}>
                <Input
                  css={styles.textInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={i18n.t('Search_Members')}
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
                  <Box css={styles.noMembers}>{i18n.t('No_Members_Found')}</Box>
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
