import { ActionButton, Box, Icon, Menu } from '@rocket.chat/fuselage';
import React, { useContext, useEffect, useState } from 'react';
import styles from './ChatHeader.module.css';
import PropTypes from 'prop-types';
import RCContext from '../../context/RCInstance';
import { useUserStore } from '../../store';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
  channelName,
}) => {
  const [channelInfo, setChannelInfo] = useState({});
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogout = async () => {
    const res = await RCInstance.logout();
    if (res.status === 'success') {
      setIsUserAuthenticated(false);
      setUser({});
      dispatchToastMessage({
        type: 'success',
        message: 'Successfully logged out',
      });
    }
  };

  useEffect(() => {
    const getChannelInfo = async () => {
      const res = await RCInstance.channelInfo();
      if (res.success) {
        setChannelInfo(res.channel);
      }
    };
    if (isUserAuthenticated) {
      getChannelInfo();
    }
  }, [isUserAuthenticated]);

  const menuOptions = () => {
    return {
      minimize: {
        action: () => setFullScreen((prev) => !prev),
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="mobile" size="x16" />
            Minimize
          </Box>
        ),
      },
      threads: {
        action: function noRefCheck() {},
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="thread" size="x16" />
            Threads
          </Box>
        ),
      },
      starred: {
        action: function noRefCheck() {},
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="star" size="x16" />
            Starred
          </Box>
        ),
      },
      pinned: {
        action: function noRefCheck() {},
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="pin" size="x16" />
            Pinned
          </Box>
        ),
      },
      ...(isUserAuthenticated && {
        logout: {
          action: handleLogout,
          label: (
            <Box alignItems="center" display="flex" color="danger">
              <Icon mie="x4" name="reply-directly" size="x16" />
              Logout
            </Box>
          ),
        },
      }),
    };
  };

  return (
    <Box className={styles.container} border="1px solid #b1b1b1" p={10}>
      <Box display="flex">
        <Icon name="hash" size={fullScreen ? 'x40' : 'x30'} />
        <Box margin={'0 1rem'}>
          {isUserAuthenticated ? (
            <>
              <h2 className={styles.nospace}>
                {channelInfo.name || channelName || 'channelName'}
              </h2>
              {fullScreen && (
                <p
                  className={styles.nospace}
                  style={{ color: 'gray', fontSize: 14 }}
                >
                  {channelInfo.description || ''}
                </p>
              )}
            </>
          ) : (
            <h2 className={styles.nospace}>{channelName || 'Login to chat'}</h2>
          )}
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        {user.success && (
          <>
            <img
              width={'20px'}
              height={'20px'}
              src={user.avatarUrl || ''}
              alt="avatar"
            />
            <p style={{ marginLeft: '2px' }}>Hi, {user.username}</p>
          </>
        )}
        {fullScreen ? (
          moreOpts && (
            <Menu margin={'0 4px'} display={'inline'} options={menuOptions()} />
          )
        ) : (
          <ActionButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
            ghost
            display={'inline'}
            square
            small
          >
            <Icon name="computer" size={'x20'} />
          </ActionButton>
        )}
        {isClosable && (
          <ActionButton
            onClick={() => {
              setClosableState((prev) => !prev);
            }}
            ghost
            display={'inline'}
            square
            small
          >
            <Icon name="cross" size={'x20'} />
          </ActionButton>
        )}
      </Box>
    </Box>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  isClosable: PropTypes.bool,
  fullScreen: PropTypes.bool,
  setClosableState: PropTypes.func,
  setFullScreen: PropTypes.func,
  moreOpts: PropTypes.bool,
  channelName: PropTypes.string,
};
