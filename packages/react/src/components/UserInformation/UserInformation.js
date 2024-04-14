import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import Sidebar from '../Sidebar/Sidebar';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';
import { Box } from '../Box';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Throbber } from '../Throbber';
import { appendClassNames } from '../../lib/appendClassNames';

const userSidebarCss = css`
  padding: 0 1rem 1rem;
  margin: 0 auto;
`;

const userRoleCss = css`
  background-color: #cbced1;
  letter-spacing: 0rem;
  font-size: 0.75rem;
  padding: 0 0.25rem;
  margin: 0 0.1rem;
  border-radius: 2px;
  font-weight: 700;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2f343d;
`;

const UserInformation = () => {
  const { RCInstance } = useContext(RCContext);

  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const [isUserInfoFetched, setIsUserInfoFetched] = useState(false);
  const setShowCurrentUserInfo = useUserStore(
    (state) => state.setShowCurrentUserInfo
  );
  const currentUser = useUserStore((state) => state.currentUser);

  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const isDifferentDay =
      date.getDate() !== now.getDate() ||
      date.getMonth() !== now.getMonth() ||
      date.getFullYear() !== now.getFullYear();

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = date.toLocaleTimeString('en-US', options);

    return isDifferentDay
      ? `${date.toLocaleDateString('en-US', {
          weekday: 'long',
        })} ${formattedTime}`
      : formattedTime;
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

  return (
    <Sidebar
      title="User Info"
      iconName="user"
      setShowWindow={setShowCurrentUserInfo}
    >
      {isUserInfoFetched ? (
        <Box css={userSidebarCss}>
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
            {currentUserInfo.roles.length && (
              <Box
                css={css`
                  margin-block: 15px;
                `}
              >
                <Box
                  css={css`
                    margin-block: 5px;
                    font-weight: bold;
                  `}
                >
                  Roles
                </Box>
                <Box
                  css={css`
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    width: 100%;
                  `}
                >
                  {currentUserInfo?.roles?.map((role, index) => (
                    <Box
                      key={index}
                      as="span"
                      css={userRoleCss}
                      className={appendClassNames('ec-message-user-role')}
                    >
                      {role === 'admin' ? 'Admin' : role}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Box
              css={css`
                margin-block: 15px;
              `}
            >
              <Box
                css={css`
                  margin-block: 5px;
                  font-weight: bold;
                `}
              >
                Username
              </Box>
              <Box
                css={css`
                  opacity: 0.5rem;
                `}
              >
                {currentUserInfo?.username}
              </Box>
            </Box>

            <Box
              css={css`
                margin-block: 15px;
              `}
            >
              <Box
                css={css`
                  margin-block: 5px;
                  font-weight: bold;
                `}
              >
                Last login
              </Box>
              <Box
                css={css`
                  opacity: 0.5rem;
                `}
              >
                {formatTimestamp(currentUserInfo.lastLogin)}
              </Box>
            </Box>

            <Box
              css={css`
                margin-block: 15px;
              `}
            >
              <Box
                css={css`
                  margin-block: 5px;
                  font-weight: bold;
                `}
              >
                Full Name
              </Box>
              <Box
                css={css`
                  opacity: 0.5rem;
                `}
              >
                {currentUserInfo.name}
              </Box>
            </Box>

            <Box
              css={css`
                margin-block: 15px;
              `}
            >
              <Box
                css={css`
                  margin-block: 5px;
                  font-weight: bold;
                `}
              >
                Email
              </Box>
              <Box
                css={css`
                  opacity: 0.5rem;
                `}
              >
                {currentUserInfo.emails?.map((email, index) => (
                  <Box
                    key={index}
                    css={css`
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      margin-block: 5px;
                    `}
                  >
                    <a
                      href={`mailto:${email.address}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {email.address}
                    </a>
                    <Box css={userRoleCss}>
                      {email.verified ? 'Verified' : 'Not Verified'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              css={css`
                margin-block: 15px;
              `}
            >
              <Box
                css={css`
                  margin-block: 5px;
                  font-weight: bold;
                `}
              >
                Created at
              </Box>
              <Box
                css={css`
                  opacity: 0.5rem;
                `}
              >
                {formatTimestamp(currentUserInfo.createdAt)}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#4a4a4a',
          }}
        >
          <Throbber />
        </Box>
      )}
    </Sidebar>
  );
};

export default UserInformation;
