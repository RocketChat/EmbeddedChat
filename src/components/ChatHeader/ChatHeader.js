import { ActionButton, Box, Icon, Menu } from '@rocket.chat/fuselage';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatHeader.module.css';
import RCContext from '../../context/RCInstance';
import {
  useUserStore,
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
} from '../../store';
import { darken, isDark, lighten } from '../../lib/color';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';
import { ThreadHeader } from '../ThreadHeader';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
  channelName,
  headerColor,
}) => {
  const computedHeaderTextColor = isDark(headerColor) ? 'white' : 'black';
  const computedHeaderBackgroundColor = headerColor;
  const computedHeaderDescriptionColor = isDark(headerColor)
    ? 'whitesmoke'
    : 'rgba(0, 0, 0, 0.5)';
  const computedIconClassName = isDark(headerColor)
    ? styles.icon_light_mode
    : styles.icon_dark_mode;
  const computedBorderColor = isDark(headerColor)
    ? lighten(headerColor, 0.3)
    : darken(headerColor, 0.3);

  const channelInfo = useChannelStore((state) => state.channelInfo);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);
  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const { RCInstance } = useContext(RCContext);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const avatarUrl = useUserStore((state) => state.avatarUrl);
  const setMessages = useMessageStore((state) => state.setMessages);
  const setFilter = useMessageStore((state) => state.setFilter);
  const isThreadOpen = useMessageStore((state) => state.isThreadOpen);
  const closeThread = useMessageStore((state) => state.closeThread);
  const threadTitle = useMessageStore((state) => state.threadMainMessage?.msg);
  const setMembersHandler = useMemberStore((state) => state.setMembersHandler);
  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);
  const showMembers = useMemberStore((state) => state.showMembers);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);

  const { handleLogout } = useRCAuth4Google();
  const showStarredMessage = async () => {
    const { messages } = await RCInstance.getStarredMessages();
    setMessages(messages);
    setFilter(true);
  };

  const showPinnedMessage = async () => {
    const { messages } = await RCInstance.getPinnedMessages();
    setMessages(messages);
    setFilter(true);
  };

  const showChannelMembers = async () => {
    const { members } = await RCInstance.getChannelMembers();
    setMembersHandler(members);
    toggleShowMembers();
    setShowSearch(false);
  };

  const showSearchMessage = async () => {
    setShowSearch(true);
    if (showMembers) toggleShowMembers();
  };

  const showChannelinformation = async () => {
    setShowChannelinfo(true);
    setShowSearch(false);
    if (showMembers) toggleShowMembers();
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
  }, [isUserAuthenticated, RCInstance]);

  const menuOptions = () => ({
    ...(fullScreen && {
      minimize: {
        action: () => setFullScreen((prev) => !prev),
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="mobile" size="x16" />
            Minimize
          </Box>
        ),
      },
    }),
    ...(moreOpts && {
      threads: {
        action: function noRefCheck() {},
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="thread" size="x16" />
            Threads
          </Box>
        ),
      },
      members: {
        action: showChannelMembers,
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="members" size="x16" />
            Members
          </Box>
        ),
      },
      starred: {
        action: showStarredMessage,
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="star" size="x16" />
            Starred
          </Box>
        ),
      },
      pinned: {
        action: showPinnedMessage,
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="pin" size="x16" />
            Pinned
          </Box>
        ),
      },
      search: {
        action: showSearchMessage,
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="magnifier" size="x16" />
            Search
          </Box>
        ),
      },
      roominfo: {
        action: showChannelinformation,
        label: (
          <Box alignItems="center" display="flex">
            <Icon mie="x4" name="info" size="x16" />
            Room Information
          </Box>
        ),
      },
    }),
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
  });

  return (
    <Box
      className={styles.container}
      border={`1px solid ${computedBorderColor}`}
      p={10}
      backgroundColor={computedHeaderBackgroundColor}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex">
          <Icon
            color={computedHeaderTextColor}
            name="hash"
            size={fullScreen ? 'x40' : 'x30'}
          />
          <Box margin="0 1rem">
            {isUserAuthenticated ? (
              <>
                <h2
                  className={styles.nospace}
                  style={{ color: computedHeaderTextColor }}
                >
                  {channelInfo.name || channelName || 'channelName'}
                </h2>
                {fullScreen && (
                  <p
                    className={styles.nospace}
                    style={{
                      color: computedHeaderDescriptionColor,
                      fontSize: 14,
                    }}
                  >
                    {channelInfo.description || ''}
                  </p>
                )}
              </>
            ) : (
              <h2
                style={{ color: computedHeaderTextColor }}
                className={styles.nospace}
              >
                {channelName || 'Login to chat'}
              </h2>
            )}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          {avatarUrl && (
            <img width="20px" height="20px" src={avatarUrl} alt="avatar" />
          )}
          {fullScreen ? (
            <Menu
              margin="0 4px"
              display="inline"
              className={computedIconClassName}
              options={menuOptions()}
            />
          ) : (
            <>
              <ActionButton
                onClick={() => {
                  setFullScreen((prev) => !prev);
                }}
                ghost
                display="inline"
                square
                small
              >
                <Icon name="computer" size="x20" />
              </ActionButton>
              <Menu margin="0 4px" display="inline" options={menuOptions()} />
            </>
          )}
          {isClosable && (
            <ActionButton
              onClick={() => {
                setClosableState((prev) => !prev);
              }}
              ghost
              display="inline"
              square
              small
              className={computedIconClassName}
            >
              <Icon name="cross" size="x20" />
            </ActionButton>
          )}
        </Box>
      </Box>
      {isThreadOpen && (
        <ThreadHeader title={threadTitle} handleClose={closeThread} />
      )}
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
  headerColor: PropTypes.string,
};
