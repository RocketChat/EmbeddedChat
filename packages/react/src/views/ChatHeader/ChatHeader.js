import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
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
import { Tooltip } from '../../components/Tooltip';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Icon } from '../../components/Icon';
import { ActionButton } from '../../components/ActionButton';
import { Menu } from '../../components/Menu';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import useFetchChatData from '../../hooks/useFetchChatData';
import useSettingsStore from '../../store/settingsStore';
import styles from './ChatHeader.styles';

const ChatHeader = ({
  isClosable,
  setClosableState,
  moreOpts,
  fullScreen,
  setFullScreen,
  channelName,
  className = '',
  style = {},
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
  const setIsChannelReadOnly = useChannelStore(
    (state) => state.setIsChannelReadOnly
  );
  const workspaceLevelRoles = useUserStore((state) => state.roles);

  const { RCInstance } = useRCContext();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const dispatchToastMessage = useToastBarDispatch();
  const getMessagesAndRoles = useFetchChatData(showRoles);
  const toastPosition = useToastStore((state) => state.position);
  const setMessageLimit = useSettingsStore((state) => state.setMessageLimit);

  const avatarUrl = useUserStore((state) => state.avatarUrl);
  const headerTitle = useMessageStore((state) => state.headerTitle);
  const filtered = useMessageStore((state) => state.filtered);
  const setFilter = useMessageStore((state) => state.setFilter);
  const threadTitle = useMessageStore((state) => state.threadMainMessage?.msg);
  const isThreadOpen = useMessageStore((state) => state.isThreadOpen);
  const closeThread = useMessageStore((state) => state.closeThread);

  const setMembersHandler = useMemberStore((state) => state.setMembersHandler);
  const setShowMembers = useMemberStore((state) => state.setShowMembers);
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

  const setExclusiveState = (stateSetters, activeSetter) => {
    stateSetters.forEach((setter) => {
      setter(setter === activeSetter);
    });
  };

  const stateSetters = useMemo(
    () => [
      setShowStarred,
      setShowPinned,
      setShowMembers,
      setShowSearch,
      setShowChannelinfo,
      setShowAllThreads,
      setShowAllFiles,
      setShowMentions,
    ],
    [
      setShowStarred,
      setShowPinned,
      setShowMembers,
      setShowSearch,
      setShowChannelinfo,
      setShowAllThreads,
      setShowAllFiles,
      setShowMentions,
    ]
  );

  const showStarredMessage = useCallback(async () => {
    setExclusiveState(stateSetters, setShowStarred);
  }, [setShowStarred, stateSetters]);

  const showPinnedMessage = useCallback(async () => {
    setExclusiveState(stateSetters, setShowPinned);
  }, [setShowPinned, stateSetters]);

  const showChannelMembers = useCallback(async () => {
    const { members = [] } = await RCInstance.getChannelMembers(
      isChannelPrivate
    );
    setMembersHandler(members);
    setExclusiveState(stateSetters, setShowMembers);
  }, [
    RCInstance,
    isChannelPrivate,
    setMembersHandler,
    stateSetters,
    setShowMembers,
  ]);

  const showSearchMessage = useCallback(() => {
    setExclusiveState(stateSetters, setShowSearch);
  }, [setShowSearch, stateSetters]);

  const showChannelinformation = useCallback(async () => {
    setExclusiveState(stateSetters, setShowChannelinfo);
  }, [setShowChannelinfo, stateSetters]);

  const showAllThreads = useCallback(async () => {
    setExclusiveState(stateSetters, setShowAllThreads);
  }, [setShowAllThreads, stateSetters]);

  const showAllFiles = useCallback(async () => {
    setExclusiveState(stateSetters, setShowAllFiles);
  }, [setShowAllFiles, stateSetters]);

  const showMentions = useCallback(async () => {
    setExclusiveState(stateSetters, setShowMentions);
  }, [setShowMentions, stateSetters]);

  useEffect(() => {
    const getMessageLimit = async () => {
      const messageLimitObj = await RCInstance.getMessageLimit();
      setMessageLimit(messageLimitObj?.value);
    };

    const setMessageAllowed = async () => {
      const permissionRes = await RCInstance.permissionInfo();
      const channelRolesRes = await RCInstance.getChannelRoles(
        isChannelPrivate
      );

      if (permissionRes.success && channelRolesRes.success) {
        const postMsgRoles = permissionRes.update[140]?.roles || [];
        const channelLevelRoles = channelRolesRes.roles
          .filter((chRole) => chRole.u?._id === authenticatedUserId)
          .flatMap((chRole) => chRole.roles);

        const allRoles = [...channelLevelRoles, ...workspaceLevelRoles];
        const canSendMsg =
          channelLevelRoles.length > 0 &&
          postMsgRoles.some((role) => allRoles.includes(role));

        setCanSendMsg(canSendMsg);
      }
    };

    const getChannelInfo = async () => {
      const res = await RCInstance.channelInfo();
      if (res.success) {
        setChannelInfo(res.room);
        if (res.room.t === 'p') setIsChannelPrivate(true);
        if (res.room.ro) {
          setIsChannelReadOnly(true);
          setMessageAllowed();
        }
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
      getMessageLimit();
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
    authenticatedUserId,
    setMessageLimit,
    workspaceLevelRoles,
    setIsChannelReadOnly,
  ]);

  const menuOptions = useMemo(() => {
    const options = [];

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
    handleLogout,
    isUserAuthenticated,
    moreOpts,
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
      css={styles.chatHeaderParent}
      className={`ec-chat-header ${classNames} ${className}`}
      style={{ ...styleOverrides, ...style }}
    >
      <Box css={styles.chatHeaderChild}>
        <Box css={styles.channelDescription}>
          <Icon name="hash" size={fullScreen ? '1.25rem' : '1rem'} />
          <Box
            css={css`
              margin: 0 1rem;
            `}
          >
            {isUserAuthenticated ? (
              <>
                <h2
                  className="ec-chat-header--channelName"
                  css={styles.clearSpacing}
                >
                  {channelInfo.name || channelName || 'channelName'}
                </h2>
                {fullScreen && (
                  <p
                    className="ec-chat-header--channelDescription"
                    css={styles.clearSpacing}
                  >
                    {channelInfo.description || ''}
                  </p>
                )}
              </>
            ) : (
              <h2
                className="ec-chat-header--channelDescription"
                css={styles.clearSpacing}
              >
                {channelName || 'Login to chat'}
              </h2>
            )}
          </Box>
        </Box>
        <Box css={styles.chatHeaderIconRow}>
          {avatarUrl && (
            <img width="20px" height="20px" src={avatarUrl} alt="avatar" />
          )}

          <Tooltip
            text={`${fullScreen ? 'Minimize' : 'Maximize'}`}
            position="bottom"
          >
            <ActionButton
              onClick={() => {
                setFullScreen((prev) => !prev);
              }}
              ghost
              display="inline"
              square
              size="medium"
            >
              <Icon
                name={`${fullScreen ? 'collapse' : 'expand'}`}
                size="1.25rem"
              />
            </ActionButton>
          </Tooltip>

          <Menu options={menuOptions} />

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
  style: PropTypes.object,
};
