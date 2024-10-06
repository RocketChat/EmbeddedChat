import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Sidebar,
  Avatar,
  Icon,
  Throbber,
  Popup,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';
import formatTimestamp from '../../lib/formatTimestamp';
import UserInfoField from './UserInfoField';
import getUserInformationStyles from './UserInformation.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const UserInformation = () => {
  const { variantOverrides } = useComponentOverrides('UserInformation');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const styles = getUserInformationStyles(theme);
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [isUserInfoFetched, setIsUserInfoFetched] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const authenticatedUserRoles = useUserStore((state) => state.roles);
  const authenticatedUserId = useUserStore((state) => state.userId);
  const isAdmin = authenticatedUserRoles?.includes('admin');
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${username}`;
  };

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const res = await RCInstance.userInfo(currentUser._id);
        if (res?.user) {
          setCurrentUserInfo(res.user);
          setIsUserInfoFetched(true);
        }
      } catch (err) {
        console.error('Error fetching current user info', err);
      }
    };

    getCurrentUserInfo();
  }, [RCInstance, setCurrentUserInfo]);

  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title="User Info"
      iconName="user"
      onClose={() => setExclusiveState(null)}
      {...(viewType === 'Popup'
        ? {
            isPopupHeader: true,
          }
        : {})}
    >
      {isUserInfoFetched ? (
        <Box css={styles.userSidebar}>
          <Avatar
            size="100%"
            url={getUserAvatarUrl(currentUserInfo.username)}
          />
          <Box>
            <Box
              css={css`
                display: flex;
                align-items: center;
                margin-block: 16px;
                font-size: 1.25rem;
                font-weight: bold;
              `}
            >
              <Icon
                name={currentUserInfo.status}
                size="1.25rem"
                style={{
                  padding: '0.125em',
                  marginRight: '0.5rem',
                  alignSelf: 'center',
                }}
              />
              {currentUserInfo?.username}
            </Box>
            {currentUserInfo?.roles?.length && (
              <UserInfoField
                label="Roles"
                value={
                  <Box css={styles.roleContainer}>
                    {currentUserInfo?.roles?.map((role, index) => (
                      <Box
                        key={index}
                        as="span"
                        css={styles.userRole}
                        className={appendClassNames('ec-message-user-role')}
                      >
                        {role === 'admin' ? 'admin' : role}
                      </Box>
                    ))}
                  </Box>
                }
                isAdmin={isAdmin}
                authenticatedUserId={authenticatedUserId}
                currentUserInfo={currentUserInfo}
              />
            )}
            <UserInfoField
              label="Username"
              value={currentUserInfo?.username}
              isAdmin={isAdmin}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label="Last login"
              value={formatTimestamp(currentUserInfo.lastLogin)}
              isAdmin={isAdmin}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label="Full Name"
              value={currentUserInfo.name}
              isAdmin={isAdmin}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label="Email"
              value={currentUserInfo.emails?.map((email, index) => (
                <Box key={index} css={styles.emailContainer}>
                  <a
                    href={`mailto:${email.address}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {email.address}
                  </a>
                  <Box css={styles.userRole}>
                    {email.verified ? 'Verified' : 'Not Verified'}
                  </Box>
                </Box>
              ))}
              isAdmin={isAdmin}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label="Created at"
              value={formatTimestamp(currentUserInfo.createdAt)}
              isAdmin={isAdmin}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
          </Box>
        </Box>
      ) : (
        <Box css={styles.centeredColumnStyles}>
          <Throbber />
        </Box>
      )}
    </ViewComponent>
  );
};

export default UserInformation;
