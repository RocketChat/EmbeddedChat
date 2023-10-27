import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
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
import { Menu } from '../Menu';

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

  const handleLogout = useCallback(async () => {
    try {
      await RCInstance.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUserAuthenticated(false);
    }
  }, [RCInstance, setIsUserAuthenticated]);

  const showStarredMessage = useCallback(async () => {
    const { messages } = await RCInstance.getStarredMessages();
    setMessages(messages);
    setFilter(true);
  }, [RCInstance, setMessages, setFilter]);

  const showPinnedMessage = useCallback(async () => {
    const { messages } = await RCInstance.getPinnedMessages();
    setMessages(messages);
    setFilter(true);
  }, [RCInstance, setMessages, setFilter]);

  const showChannelMembers = useCallback(async () => {
    const { members = [] } = await RCInstance.getChannelMembers();
    setMembersHandler(members);
    toggleShowMembers();
    setShowSearch(false);
  }, [RCInstance, setMembersHandler, toggleShowMembers, setShowSearch]);

  const showSearchMessage = useCallback(() => {
    setShowSearch(true);
    if (showMembers) toggleShowMembers();
  }, [setShowSearch, showMembers, toggleShowMembers]);

  const showChannelinformation = useCallback(async () => {
    setShowChannelinfo(true);
    setShowSearch(false);
    if (showMembers) toggleShowMembers();
  }, [setShowChannelinfo, setShowSearch, showMembers, toggleShowMembers]);

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
  }, [isUserAuthenticated, RCInstance, setChannelInfo]);

  const menuOptions = useMemo(() => {
    const options = [];
    if (fullScreen) {
      options.push({
        id: 'minimize',
        action: () => setFullScreen((prev) => !prev),
        icon: 'mobile',
        label: 'Minimize',
      });
    }
    if (moreOpts) {
      options.push(
        ...[
          {
            id: 'thread',
            action: function noRefCheck() {},
            label: 'Threads',
            icon: 'thread',
          },
          {
            id: 'members',
            action: showChannelMembers,
            label: 'Members',
            icon: 'members',
          },
          {
            id: 'starred',
            action: showStarredMessage,
            label: 'Starred',
            icon: 'star',
          },
          {
            id: 'pinned',
            action: showPinnedMessage,
            label: 'Pinned',
            icon: 'pin',
          },
          {
            id: 'search',
            action: showSearchMessage,
            label: 'Search',
            icon: 'magnifier',
          },
          {
            id: 'rInfo',
            action: showChannelinformation,
            label: 'Room Information',
            icon: 'info',
          },
        ]
      );
    }
    if (isUserAuthenticated) {
      options.push({
        id: 'logout',
        action: handleLogout,
        label: 'Logout',
        icon: 'reply-directly',
        color: 'error',
      });
    }
    return options;
  }, [
    fullScreen,
    handleLogout,
    isUserAuthenticated,
    moreOpts,
    setFullScreen,
    showChannelMembers,
    showChannelinformation,
    showPinnedMessage,
    showSearchMessage,
    showStarredMessage,
  ]);
  console.log(menuOptions);

  const chatHeaderContainer = css`
    display: flex;
    width: 100%;
    flex-direction: column;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.5);
  `;

  const channelNameStyles = css`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  `;

  const channelDescriptionStyles = css`
    margin: 0 1rem;
  `;

  return (
    <Box
      css={chatHeaderContainer}
      className={`ec-chat-header  ${classNames} ${className}`}
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
        <Box css={channelNameStyles}>
          <Icon name="hash" size={fullScreen ? '1.25rem' : '1rem'} />
          <Box css={channelDescriptionStyles}>
            {isUserAuthenticated ? (
              <>
                <h2 className={`ec-chat-header--channelName %`}>
                  {channelInfo.name || channelName || 'channelName'}
                </h2>
                {fullScreen && (
                  <p
                    className={`ec-chat-header--channelDescription ${channelDescriptionStyles}`}
                    style={{ fontSize: 14 }}
                  >
                    {channelInfo.description || ''}
                  </p>
                )}
              </>
            ) : (
              <h2
                className={`ec-chat-header--channelDescription ${channelDescriptionStyles}`}
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
            <Menu options={menuOptions} />
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
              <Menu options={menuOptions} />
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
