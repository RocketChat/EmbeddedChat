import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useRCContext } from '../../context/RCInstance';
import Heading from '../../components/Heading/Heading';
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
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Icon } from '../../components/Icon';
import { ActionButton } from '../../components/ActionButton';
import { Menu } from '../../components/Menu';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import useFetchChatData from '../../hooks/useFetchChatData';
import useSettingsStore from '../../store/settingsStore';
import useChatHeaderStyles from './ChatHeader.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const ChatHeader = ({
  isClosable,
  setClosableState,
  fullScreen,
  setFullScreen,
  channelName,
  className = '',
  style = {},
  anonymousMode,
  showRoles,
  optionConfig = {
    chatOptions: [
      'minmax',
      'close',
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

    threshold: 2,
  },
}) => {
  const { classNames, styleOverrides, configOverrides } =
    useComponentOverrides('ChatHeader');

  const chatOptions =
    configOverrides.optionConfig?.chatOptions || optionConfig.chatOptions;
  const threshold =
    configOverrides.optionConfig?.threshold || optionConfig.threshold;

  const styles = useChatHeaderStyles();
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

  const menuMap = {
    minmax: (
      <Tooltip
        text={`${fullScreen ? 'Minimize' : 'Maximize'}`}
        position="bottom"
        key="minmax"
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
          <Icon name={`${fullScreen ? 'collapse' : 'expand'}`} size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    close: isClosable && (
      <ActionButton
        key="close"
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
    ),
    thread: (
      <Tooltip text="Threads" position="bottom" key="thread">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowAllThreads);
          }}
        >
          <Icon name="thread" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    mentions: (
      <Tooltip text="Mentions" position="bottom" key="mention">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowMentions);
          }}
        >
          <Icon name="at" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    starred: (
      <Tooltip text="Starred Messages" position="bottom" key="starred">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowStarred);
          }}
        >
          <Icon name="star" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    pinned: (
      <Tooltip text="Pinned Messages" position="bottom" key="pinned">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowPinned);
          }}
        >
          <Icon name="pin" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    members: isUserAuthenticated && (
      <Tooltip text="Members" position="bottom" key="members">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowMembers);
          }}
        >
          <Icon name="members" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    files: isUserAuthenticated && (
      <Tooltip text="Files" position="bottom" key="files">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowAllFiles);
          }}
        >
          <Icon name="clip" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    search: isUserAuthenticated && (
      <Tooltip text="Search Messages" position="bottom" key="search">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowSearch);
          }}
        >
          <Icon name="magnifier" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    rInfo: isUserAuthenticated && (
      <Tooltip text="Room Information" position="bottom" key="rInfo">
        <ActionButton
          square
          ghost
          onClick={() => {
            setExclusiveState(setShowChannelinfo);
          }}
        >
          <Icon name="info" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),

    logout: isUserAuthenticated && (
      <Tooltip text="Logout" position="bottom" key="logout">
        <ActionButton
          square
          ghost
          onClick={() => {
            handleLogout();
          }}
        >
          <Icon name="reply-directly" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
  };

  const menuOptions = chatOptions
    .slice(threshold)
    .map((key) => {
      const tool = menuMap[key];

      if (!tool) {
        return null;
      }

      const { onClick } = tool.props.children.props;
      const { name: icon } = tool.props.children.props.children.props;
      const { text } = tool.props;

      if (onClick && icon && text) {
        return {
          id: key,
          action: onClick,
          label: text,
          icon,
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

          {chatOptions.slice(0, threshold).map((key) => menuMap[key])}
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
  channelName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};
