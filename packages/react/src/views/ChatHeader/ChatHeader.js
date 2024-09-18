import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  Icon,
  Menu,
  useToastBarDispatch,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import { useRCContext } from '../../context/RCInstance';
import {
  useUserStore,
  useMessageStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
  useThreadsMessageStore,
  useMentionsStore,
  usePinnedMessageStore,
  useStarredMessageStore,
  useFileStore,
} from '../../store';
import { DynamicHeader } from '../DynamicHeader';
import useFetchChatData from '../../hooks/useFetchChatData';
import useSettingsStore from '../../store/settingsStore';
import getChatHeaderStyles from './ChatHeader.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import SurfaceMenu from '../SurfaceMenu/SurfaceMenu';

const ChatHeader = ({
  isClosable,
  setClosableState,
  fullScreen,
  setFullScreen,
  className = '',
  style = {},
  optionConfig = {
    surfaceItems: ['minmax', 'close'],
    menuItems: [
      'thread',
      'mentions',
      'starred',
      'pinned',
      'files',
      'members',
      'search',
      'rInfo',
      'logout',
    ],
  },
}) => {
  const { classNames, styleOverrides, configOverrides } =
    useComponentOverrides('ChatHeader');

  const surfaceItems =
    configOverrides.optionConfig?.surfaceItems || optionConfig.surfaceItems;
  const menuItems =
    configOverrides.optionConfig?.menuItems || optionConfig.menuItems;
  const theme = useTheme();
  const styles = getChatHeaderStyles(theme);
  const setExclusiveState = useSetExclusiveState();
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

  const { RCInstance, ECOptions } = useRCContext();
  const { channelName, anonymousMode, showRoles } = ECOptions ?? {};

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const dispatchToastMessage = useToastBarDispatch();
  const getMessagesAndRoles = useFetchChatData(showRoles);
  const setMessageLimit = useSettingsStore((state) => state.setMessageLimit);

  const avatarUrl = useUserStore((state) => state.avatarUrl);
  const headerTitle = useMessageStore((state) => state.headerTitle);
  const filtered = useMessageStore((state) => state.filtered);
  const setFilter = useMessageStore((state) => state.setFilter);

  const isThreadOpen = useMessageStore((state) => state.isThreadOpen);
  const threadMainMessage = useMessageStore((state) => state.threadMainMessage);
  const threadTitle =
    threadMainMessage?.msg ||
    (threadMainMessage?.file ? threadMainMessage.file.name : '');

  const closeThread = useMessageStore((state) => state.closeThread);

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
        const canSendMsg = postMsgRoles.some((role) => allRoles.includes(role));

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
        });
        await RCInstance.logout();
      } else if ('errorType' in res && res.errorType === 'Not Allowed') {
        dispatchToastMessage({
          type: 'error',
          message:
            "You don't have permission to access this channel. Logging out",
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
    isChannelPrivate,
    setCanSendMsg,
    authenticatedUserId,
    setMessageLimit,
    workspaceLevelRoles,
    setIsChannelReadOnly,
  ]);

  const options = useMemo(
    () => ({
      minmax: {
        label: `${fullScreen ? 'Minimize' : 'Maximize'}`,
        id: 'minmax',
        onClick: () => setFullScreen((prev) => !prev),
        iconName: `${fullScreen ? 'collapse' : 'expand'}`,
        visible: true,
      },
      close: {
        label: 'Close',
        id: 'close',
        onClick: () => setClosableState((prev) => !prev),
        iconName: 'cross',
        visible: isClosable,
      },
      thread: {
        label: 'Threads',
        id: 'thread',
        onClick: () => setExclusiveState(setShowAllThreads),
        iconName: 'thread',
        visible: true,
      },
      mentions: {
        label: 'Mentions',
        id: 'mention',
        onClick: () => setExclusiveState(setShowMentions),
        iconName: 'at',
        visible: true,
      },
      starred: {
        label: 'Starred Messages',
        id: 'starred',
        onClick: () => setExclusiveState(setShowStarred),
        iconName: 'star',
        visible: true,
      },
      pinned: {
        label: 'Pinned Messages',
        id: 'pinned',
        onClick: () => setExclusiveState(setShowPinned),
        iconName: 'pin',
        visible: true,
      },
      members: {
        label: 'Members',
        id: 'members',
        onClick: () => setExclusiveState(setShowMembers),
        iconName: 'members',
        visible: isUserAuthenticated,
      },
      files: {
        label: 'Files',
        id: 'files',
        onClick: () => setExclusiveState(setShowAllFiles),
        iconName: 'clip',
        visible: isUserAuthenticated,
      },
      search: {
        label: 'Search Messages',
        id: 'search',
        onClick: () => setExclusiveState(setShowSearch),
        iconName: 'magnifier',
        visible: isUserAuthenticated,
      },
      rInfo: {
        label: 'Room Information',
        id: 'rInfo',
        onClick: () => setExclusiveState(setShowChannelinfo),
        iconName: 'info',
        visible: isUserAuthenticated,
      },
      logout: {
        label: 'Logout',
        id: 'logout',
        onClick: handleLogout,
        iconName: 'reply-directly',
        visible: isUserAuthenticated,
      },
    }),
    [
      fullScreen,
      isClosable,
      isUserAuthenticated,
      handleLogout,
      setFullScreen,
      setClosableState,
      setExclusiveState,
      setShowAllThreads,
      setShowMentions,
      setShowStarred,
      setShowPinned,
      setShowMembers,
      setShowAllFiles,
      setShowSearch,
      setShowChannelinfo,
    ]
  );

  const menuOptions = menuItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          action: options[item].onClick,
          label: options[item].label,
          icon: options[item].iconName,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  const surfaceOptions = surfaceItems
    ?.map((item) => {
      if (item in options && options[item].visible) {
        return {
          id: options[item].id,
          onClick: options[item].onClick,
          label: options[item].label,
          iconName: options[item].iconName,
        };
      }
      return null;
    })
    .filter((option) => option !== null);

  return (
    <Box
      css={styles.chatHeaderParent}
      className={`ec-chat-header ${classNames} ${className}`}
      style={{ ...styleOverrides, ...style }}
    >
      <Box css={styles.chatHeaderChild}>
        <Box css={styles.channelDescription}>
          <Icon name="hash" size={fullScreen ? '1.25rem' : '1rem'} />
          <Box>
            {isUserAuthenticated ? (
              <>
                <Heading
                  level={3}
                  className="ec-chat-header--channelName"
                  css={styles.clearSpacing}
                >
                  {channelInfo.name || channelName || 'channelName'}
                </Heading>
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
              <Heading
                level={3}
                className="ec-chat-header--channelName"
                css={styles.clearSpacing}
              >
                {channelName || 'Login to chat'}
              </Heading>
            )}
          </Box>
        </Box>
        <Box css={styles.chatHeaderIconRow}>
          {avatarUrl && (
            <img width="20px" height="20px" src={avatarUrl} alt="avatar" />
          )}

          {surfaceOptions.length > 0 && (
            <SurfaceMenu options={surfaceOptions} />
          )}
          {menuOptions.length > 0 && <Menu options={menuOptions} />}
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
  className: PropTypes.string,
  style: PropTypes.object,
};
