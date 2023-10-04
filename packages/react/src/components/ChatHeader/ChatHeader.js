import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react'; // Step 1: Import `css` from Emotion.sh
import stylesSheet from './ChatHeader.module.css';
import RCContext from '../../context/RCInstance';
import {
  useUserStore,
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
} from '../../store';
import { ThreadHeader } from '../ThreadHeader';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';

const iconMap = {
  danger: 'modal-warning',
  warning: 'modal-warning',
  info: 'info',
  success: 'check',
};

// Define Emotion.sh styles for your component
const styles = {
  container: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.5);
  `,
  nospace: css`
    margin: 0;
    padding: 0;
  `,
};

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
  channelName,
  className = '',
  styles = {},
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatHeader');
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);
  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );

  const { RCInstance } = useContext(RCContext);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
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

  const handleLogout = async () => {
    try {
      await RCInstance.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUserAuthenticated(false);
    }
  };

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
    const { members = [] } = await RCInstance.getChannelMembers();
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
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="mobile"
              size="1em"
            />
            Minimize
          </Box>
        ),
      },
    }),
    ...(moreOpts && {
      threads: {
        action: function noRefCheck() {},
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="thread"
              size="1em"
            />
            Threads
          </Box>
        ),
      },
      members: {
        action: showChannelMembers,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="members"
              size="1em"
            />
            Members
          </Box>
        ),
      },
      starred: {
        action: showStarredMessage,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="star"
              size="1em"
            />
            Starred
          </Box>
        ),
      },
      pinned: {
        action: showPinnedMessage,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon style={{ marginInlineEnd: '0.4rem' }} name="pin" size="1em" />
            Pinned
          </Box>
        ),
      },
      search: {
        action: showSearchMessage,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="magnifier"
              size="1em"
            />
            Search
          </Box>
        ),
      },
      roominfo: {
        action: showChannelinformation,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }}>
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="info"
              size="1em"
            />
            Room Information
          </Box>
        ),
      },
    }),
    ...(isUserAuthenticated && {
      logout: {
        action: handleLogout,
        label: (
          <Box style={{ alignItems: 'center', display: 'flex' }} color="danger">
            <Icon
              style={{ marginInlineEnd: '0.4rem' }}
              name="reply-directly"
              size="1em"
            />
            Logout
          </Box>
        ),
      },
    }),
  });

  return (
    <Box
      css={[styles.container, classNames]} // Apply Emotion.sh styles
      className={`${stylesSheet.container} ${className}`}
      style={{ ...styleOverrides, ...styles }}
    >
      <Box
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Box
          css={css`
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            align-items: center;
          `}
        >
          <Icon name="hash" size={fullScreen ? '1.25rem' : '1rem'} />
          <Box
            css={css`
              margin: 0 1rem;
            `}
          >
            {isUserAuthenticated ? (
              <>
                <h2
                  className={`ec-chat-header--channelName ${styles.nospace}`}
                >
                  {channelInfo.name || channelName || 'channelName'}
                </h2>
                {fullScreen && (
                  <p
                    className={`ec-chat-header--channelDescription ${styles.nospace}`}
                    style={{ fontSize: 14 }}
                  >
                    {channelInfo.description || ''}
                  </p>
                )}
              </>
            ) : (
              <h2
                className={`ec-chat-header--channelDescription ${styles.nospace}`}
              >
                {channelName || 'Login to chat'}
              </h2>
            )}
          </Box>
        </Box>
        <Box
          css={css`
            display: flex;
            align-items: center;
            gap: 0.125em;
          `}
        >
          {avatarUrl && (
            <img width="20px" height="20px" src={avatarUrl} alt="avatar" />
          )}
          {fullScreen ? (
            <Menu margin="0 4px" display="inline" options={menuOptions()} />
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
                <Icon name="computer" size="1.25rem" />
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
            >
              <Icon name="cross" size="1.25rem" />
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
  className: PropTypes.string,
  styles: PropTypes.object,
};
