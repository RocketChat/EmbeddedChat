import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import stylesSheet from './ChatHeader.module.css';
import { useRCContext } from '../../context/RCInstance';
import {
  useUserStore,
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
  useToastStore,
  useThreadsMessageStore,
  useMentionsStore,
  usePinnedMessageStore,
  useStarredMessageStore,
  useFileStore,
} from '../../store';
import { DynamicHeader } from '../DynamicHeader';
import { Tooltip } from '../Tooltip';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Menu } from '../Menu';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import useFetchChatData from '../../hooks/useFetchChatData';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
  channelName,
  className = '',
  styles = {},
  anonymousMode,
  showRoles,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatHeader');
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);
  const setShowChannelinfo = useChannelStore(
    (state) => state.setShowChannelinfo
  );
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const setIsChannelPrivate = useChannelStore(
    (state) => state.setIsChannelPrivate
  );

  const { RCInstance } = useRCContext();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const dispatchToastMessage = useToastBarDispatch();
  const getMessagesAndRoles = useFetchChatData(showRoles);

  const avatarUrl = useUserStore((state) => state.avatarUrl);
  const headerTitle = useMessageStore((state) => state.headerTitle);
  const filtered = useMessageStore((state) => state.filtered);
  const setMessages = useMessageStore((state) => state.setMessages);
  const setFilter = useMessageStore((state) => state.setFilter);
  const isThreadOpen = useMessageStore((state) => state.isThreadOpen);
  const closeThread = useMessageStore((state) => state.closeThread);
  const threadTitle = useMessageStore((state) => state.threadMainMessage?.msg);
  const setHeaderTitle = useMessageStore((state) => state.setHeaderTitle);
  const setMembersHandler = useMemberStore((state) => state.setMembersHandler);
  const toggleShowMembers = useMemberStore((state) => state.toggleShowMembers);
  const showMembers = useMemberStore((state) => state.showMembers);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);
  const setShowPinned = usePinnedMessageStore((state) => state.setShowPinned);
  const setShowStarred = useStarredMessageStore(
    (state) => state.setShowStarred
  );
  const setShowAllThreads = useThreadsMessageStore(
    (state) => state.setShowAllThreads
  );
  const setShowAllFiles = useFileStore((state) => state.setShowAllFiles);
  const setShowMentions = useMentionsStore((state) => state.setShowMentions);
  const toastPosition = useToastStore((state) => state.position);

  const handleGoBack = async () => {
    if (isUserAuthenticated) {
      getMessagesAndRoles();
    } else {
      getMessagesAndRoles(anonymousMode);
    }
    setFilter(false);
  };
  const setCanSendMsg = useUserStore((state) => state.setCanSendMsg);
  const authenticatedUserId = useUserStore((state) => state.userId);

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
    setShowStarred(true);
  }, [RCInstance, setShowStarred]);

  const showPinnedMessage = useCallback(async () => {
    setShowPinned(true);
  }, [RCInstance, setShowPinned]);

  const showChannelMembers = useCallback(async () => {
    const { members = [] } = await RCInstance.getChannelMembers(
      isChannelPrivate
    );
    setMembersHandler(members);
    toggleShowMembers();
    setShowSearch(false);
  }, [
    RCInstance,
    setMembersHandler,
    toggleShowMembers,
    setShowSearch,
    isChannelPrivate,
  ]);

  const showSearchMessage = useCallback(() => {
    setShowSearch(true);
    if (showMembers) toggleShowMembers();
  }, [setShowSearch, showMembers, toggleShowMembers]);

  const showChannelinformation = useCallback(async () => {
    setShowChannelinfo(true);
    setShowSearch(false);
    if (showMembers) toggleShowMembers();
  }, [setShowChannelinfo, setShowSearch, showMembers, toggleShowMembers]);

  const showAllThreads = useCallback(async () => {
    setShowAllThreads(true);
    setShowSearch(false);
  }, [setShowAllThreads, setShowSearch]);

  const showAllFiles = useCallback(async () => {
    setShowAllFiles(true);
    setShowSearch(false);
  }, [setShowAllFiles, setShowSearch]);

  const showMentions = useCallback(async () => {
    setShowMentions(true);
    setShowSearch(false);
  }, [setShowMentions, setShowSearch]);

  const authenticatedUserRoles = useUserStore((state) => state.roles);
  const setCanPinMsg = useUserStore((state) => state.setCanPinMsg);

  useEffect(() => {
    const setMsgAndPinAllowed = async (ro) => {
      const permissionRes = await RCInstance.permissionInfo();
      const channelRolesRes = await RCInstance.getChannelRoles(
        isChannelPrivate
      );

      if (permissionRes.success && channelRolesRes.success) {
        const pinMsgRoles = permissionRes.update[146]?.roles || [];
        const postMsgRoles = permissionRes.update[140]?.roles || [];

        const channelMemberRoles = channelRolesRes.roles
          .filter((chRole) => chRole.u?._id === authenticatedUserId)
          .flatMap((chRole) => chRole.roles);

        const concatenatedRoles = channelMemberRoles.concat(
          authenticatedUserRoles
        );

        if (ro) {
          const canSendMsg =
            channelMemberRoles.length > 0 &&
            postMsgRoles.some((role) => channelMemberRoles.includes(role));
          setCanSendMsg(canSendMsg);
        }

        const canPinMsg =
          concatenatedRoles.length > 0 &&
          pinMsgRoles.some((role) => concatenatedRoles.includes(role));
        setCanPinMsg(canPinMsg);
      }
    };

    const getChannelInfo = async () => {
      const res = await RCInstance.channelInfo();
      if (res.success) {
        setChannelInfo(res.room);
        if (res.room.t === 'p') setIsChannelPrivate(true);
        setMsgAndPinAllowed(res.room.ro);
      } else if (
        'errorType' in res &&
        res.errorType === 'error-room-not-found'
      ) {
        dispatchToastMessage({
          type: 'error',
          message: "Channel doesn't exist. Logging out.",
          position: toastPosition,
        });
        await RCInstance.logout();
      } else if ('errorType' in res && res.errorType === 'Not Allowed') {
        dispatchToastMessage({
          type: 'error',
          message:
            "You don't have permission to access this channel. Logging out",
          position: toastPosition,
        });
        await RCInstance.logout();
      }
    };

    if (isUserAuthenticated) {
      getChannelInfo();
    }
  }, [
    isUserAuthenticated,
    RCInstance,
    setChannelInfo,
    setIsChannelPrivate,
    dispatchToastMessage,
    toastPosition,
    isChannelPrivate,
    setCanSendMsg,
    setCanPinMsg,
    authenticatedUserId,
    authenticatedUserRoles,
  ]);

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
            action: showAllThreads,
            label: 'Threads',
            icon: 'thread',
          },
          {
            id: 'mentions',
            action: showMentions,
            label: 'Mentions',
            icon: 'at',
          },
          {
            id: 'members',
            action: showChannelMembers,
            label: 'Members',
            icon: 'members',
          },
          {
            id: 'files',
            action: showAllFiles,
            label: 'Files',
            icon: 'clip',
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
    showAllFiles,
    showAllThreads,
    showMentions,
    showChannelMembers,
    showChannelinformation,
    showPinnedMessage,
    showSearchMessage,
    showStarredMessage,
  ]);

  return (
    <Box
      css={css`
        display: flex;
        width: 100%;
        flex-direction: column;
        padding: 0.75rem;
        border: 1px solid rgba(0, 0, 0, 0.5);
      `}
      className={`ec-chat-header ${stylesSheet.container} ${classNames} ${className}`}
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
                  className={`ec-chat-header--channelName ${stylesSheet.nospace}`}
                >
                  {channelInfo.name || channelName || 'channelName'}
                </h2>
                {fullScreen && (
                  <p
                    className={`ec-chat-header--channelDescription ${stylesSheet.nospace}`}
                    style={{ fontSize: 14 }}
                  >
                    {channelInfo.description || ''}
                  </p>
                )}
              </>
            ) : (
              <h2
                className={`ec-chat-header--channelDescription ${stylesSheet.nospace}`}
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
              <Tooltip text="Maximize" position="bottom">
                <ActionButton
                  onClick={() => {
                    setFullScreen((prev) => !prev);
                  }}
                  ghost
                  display="inline"
                  square
                  size="medium"
                >
                  <Icon name="computer" size="1.25rem" />
                </ActionButton>
              </Tooltip>
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
              size="medium"
            >
              <Icon name="cross" size="1.25rem" />
            </ActionButton>
          )}
        </Box>
      </Box>
      {isThreadOpen && (
        <DynamicHeader
          title={threadTitle}
          handleClose={closeThread}
          iconName="arrow-back"
        />
      )}

      {!isThreadOpen && filtered && (
        <DynamicHeader
          title={headerTitle}
          handleClose={handleGoBack}
          iconName="arrow-back"
          isHeaderIcon
          headerIconName={
            headerTitle && headerTitle.includes('Pin') ? 'pin' : 'star'
          }
        />
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
