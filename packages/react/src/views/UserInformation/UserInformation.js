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
import i18n from '@embeddedchat/i18n';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';
import formatTimestamp from '../../lib/formatTimestamp';
import formatTimestampGetDate from '../../lib/formatTimestampGetDate';
import UserInfoField from './UserInfoField';
import getUserInformationStyles from './UserInformation.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const UserInformation = () => {
  const { variantOverrides } = useComponentOverrides('UserInformation');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const setExclusiveState = useSetExclusiveState();
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = getUserInformationStyles(theme);
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [isUserInfoFetched, setIsUserInfoFetched] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const currentUserRoles = useUserStore((state) => state.roles);
  const viewUserFullInfoRoles = useUserStore(
    (state) => state.viewUserInfoPermissions.roles
  );
  const authenticatedUserId = useUserStore((state) => state.userId);
  const viewInfoRoles = new Set(viewUserFullInfoRoles);
  const isAllowedToViewFullInfo = currentUserRoles.some((role) =>
    viewInfoRoles.has(role)
  );
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${username}`;
  };

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const res = await RCInstance.userData(currentUser.username);
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
      title={i18n.t('User_Info')}
      iconName="user"
      onClose={() => setExclusiveState(null)}
      style={{
        width: '400px',
        zIndex: window.innerWidth <= 780 ? 1 : null,
      }}
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
            {currentUserInfo?.statusText && (
              <Box
                css={css`
                  margin-bottom: 20px;
                `}
              >
                {currentUserInfo?.statusText}
              </Box>
            )}
            {currentUserInfo?.nickname && (
              <UserInfoField
                label={i18n.t('Nickname')}
                value={currentUserInfo?.nickname}
                isAdmin={isAllowedToViewFullInfo}
                authenticatedUserId={authenticatedUserId}
                currentUserInfo={currentUserInfo}
              />
            )}
            {currentUserInfo?.roles?.length && (
              <UserInfoField
                label={i18n.t('Roles')}
                value={
                  <Box css={styles.roleContainer}>
                    {currentUserInfo?.roles?.map((role, index) => (
                      <Box
                        key={index}
                        as="span"
                        css={styles.userRole}
                        className={appendClassNames('ec-message-user-role')}
                      >
                        {role === 'admin'
                          ? i18n.t('Admin')
                          : role === 'user'
                          ? i18n.t('user')
                          : role.charAt(0).toUpperCase() + role.slice(1)}
                      </Box>
                    ))}
                  </Box>
                }
                isAdmin={isAllowedToViewFullInfo}
                authenticatedUserId={authenticatedUserId}
                currentUserInfo={currentUserInfo}
              />
            )}
            <UserInfoField
              label={i18n.t('Username')}
              value={currentUserInfo?.username}
              isAdmin
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label={i18n.t('Last_Login')}
              value={
                currentUserInfo?.username === 'rocket.cat'
                  ? 'Never'
                  : formatTimestamp(currentUserInfo.lastLogin)
              }
              isAdmin={isAllowedToViewFullInfo}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label={i18n.t('Full_Name')}
              value={currentUserInfo.name}
              isAdmin={isAllowedToViewFullInfo}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            {currentUserInfo?.bio && (
              <UserInfoField
                label={i18n.t('Bio')}
                value={currentUserInfo?.bio}
                isAdmin={isAllowedToViewFullInfo}
                authenticatedUserId={authenticatedUserId}
                currentUserInfo={currentUserInfo}
              />
            )}
            <UserInfoField
              label={i18n.t('Email')}
              value={currentUserInfo.emails?.map((email, index) => (
                <Box key={index} css={styles.emailContainer}>
                  <a
                    href={i18n.t('Mailto_Email', { email: email.address })}
                    style={{
                      textDecoration: 'underline',
                      color:
                        mode === 'light'
                          ? theme.colors.info
                          : theme.colors.warningForeground,
                    }}
                  >
                    {email.address}
                  </a>
                  <Box css={styles.userRole}>
                    {email.verified
                      ? i18n.t('Verified')
                      : i18n.t('Verified_Not')}
                  </Box>
                </Box>
              ))}
              isAdmin={isAllowedToViewFullInfo}
              authenticatedUserId={authenticatedUserId}
              currentUserInfo={currentUserInfo}
            />
            <UserInfoField
              label={i18n.t('Created_At')}
              value={formatTimestampGetDate(currentUserInfo.createdAt)}
              isAdmin={isAllowedToViewFullInfo}
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
