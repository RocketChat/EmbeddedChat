import React, { useContext, useEffect } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar/Avatar';
import RCContext from '../../context/RCInstance';
import classes from './UserInformation.module.css';
import { useUserInfoStore, useUserStore } from '../../store';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const UserInfo = ({ message }) => {
  const { RCInstance } = useContext(RCContext);

  const userInfo = useUserInfoStore((state) => state.userInfo);

  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const setShowUserInfo = useUserInfoStore((state) => state.setShowUserInfo);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const toggleshowRoominfo = () => {
    setShowUserInfo(false);
  };

  const getUserAvatarURL = (username) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${username}`;
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await RCInstance.getUserByUsername(message?.u.username);
      if (res.success) {
        setUserInfo(res.user);
      }
    };

    if (isUserAuthenticated) {
      getUserInfo();
    }
  }, [isUserAuthenticated, RCInstance, setUserInfo, message]);

  return (
    <Box className={classes.component} style={{ padding: '16px' }}>
      <Box
        css={css`
          display: flex;
        `}
      >
        <h3 style={{ display: 'contents' }}>
          <Icon
            name="info"
            size="1.25rem"
            style={{ padding: '0px 20px 20px 0px' }}
          />
          <Box
            css={css`
              width: 100%;
              color: #4a4a4a;
            `}
          >
            User Information
          </Box>
          <ActionButton onClick={toggleshowRoominfo} ghost size="small">
            <Icon name="cross" size="1.25rem" />
          </ActionButton>
        </h3>
      </Box>

      <Avatar size="100%" url={getUserAvatarURL(userInfo?.username)} />
      <Box
        css={css`
          margin: 16px;
        `}
      >
        <Box
          css={css`
            margin-block: 16px;
            font-size: 1.25rem;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          # {userInfo?.username}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          Full Name
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {userInfo?.name}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          Role
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {userInfo.roles?.map((el, index) => (
            <span key={index} className={classes.chip}>
              {el}
            </span>
          ))}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          Email
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {userInfo.emails?.map((el, index) => (
            <span key={index} className={classes.chip}>
              {el.address}
            </span>
          ))}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          Last Login
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {new Date(userInfo?.lastLogin).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Box>
        <Box
          css={css`
            margin-block: 5px;
            font-weight: bold; /* Added bold font weight */
          `}
        >
          Created At
        </Box>
        <Box
          css={css`
            opacity: 0.5rem;
          `}
        >
          {new Date(userInfo?.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
