import { ActionButton, Box, Callout, Icon, Menu } from '@rocket.chat/fuselage';
import React, { useContext, useEffect, useState } from 'react';
import styles from './ChatHeader.module.css';
import PropTypes from 'prop-types';
import RCContext from '../../context/RCInstance';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
}) => {
  const [channelInfo, setChannelInfo] = useState({});
  const [calloutShow, setCalloutShow] = useState(false);
  const { RCInstance } = useContext(RCContext);

  const handleLogout = async () => {
    const res = await RCInstance.logout();
    if (res.status === 'success') {
      setCalloutShow(true);
      setTimeout(() => {
        setCalloutShow(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const getChannelInfo = async () => {
      const res = await RCInstance.channelInfo();
      if (res.success) {
        setChannelInfo(res.channel);
      }
    };
    getChannelInfo();
  }, []);

  return (
    <>
      {calloutShow && (
        <Callout title="You've successfully logged out!" type="success" />
      )}
      <Box className={styles.container} border="1px solid #b1b1b1" p={10}>
        <Box display="flex">
          <Icon name="hash" size={fullScreen ? 'x40' : 'x30'} />
          <Box margin={'0 1rem'}>
            <h2 className={styles.nospace}>
              {channelInfo.name || 'channelName'}
            </h2>
            {fullScreen && (
              <p
                className={styles.nospace}
                style={{ color: 'gray', fontSize: 14 }}
              >
                {channelInfo.description || ''}
              </p>
            )}
          </Box>
        </Box>
        <Box>
          {fullScreen ? (
            moreOpts && (
              <Menu
                margin={'0 4px'}
                display={'inline'}
                options={{
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
                  logout: {
                    action: handleLogout,
                    label: (
                      <Box alignItems="center" display="flex">
                        Logout
                      </Box>
                    ),
                  },
                }}
              />
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
    </>
  );
};

export default ChatHeader;

ChatHeader.propTypes = {
  isClosable: PropTypes.bool,
  fullScreen: PropTypes.bool,
  setClosableState: PropTypes.func,
  setFullScreen: PropTypes.func,
  moreOpts: PropTypes.bool,
};
