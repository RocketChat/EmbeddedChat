import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useMemberStore, useUserStore } from '../../store';
import { Icon } from '../../components/Icon';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../../components/Tooltip';
import { useMessageHeaderStyles } from './Message.styles';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const MessageHeader = ({
  message,
  isTimeStamped = true,
  isRoles = false,
  showName = true,
}) => {
  const { styleOverrides, classNames } = useComponentOverrides('MessageHeader');

  const styles = useMessageHeaderStyles();
  const colors = useCustomTheme();

  const authenticatedUserId = useUserStore((state) => state.userId);
  const showRoles = useUserStore((state) => state.showRoles);
  const showUsername = useUserStore((state) => state.showUsername);
  const showNameGlobal = useUserStore((state) => state.showName);

  const channelLevelRoles = useMemberStore((state) => state.memberRoles);
  const admins = useMemberStore((state) => state.admins);

  const isPinned = message.pinned;
  const isStarred =
    message.starred &&
    message.starred.find((u) => u._id === authenticatedUserId);
  const userActions = () => {
    switch (message.t) {
      case 'ul':
        return 'left the channel';
      case 'uj':
        return 'joined the channel';
      case 'ru':
        return `removed @${message.message || message.msg}`;
      case 'au':
        return `added @${message.message || message.msg}`;
      case 'message_pinned':
        return 'Pinned a message:';
      case 'rm':
        return 'message removed';
      case 'subscription-role-added':
        return `set ${message?.msg} as ${message?.role}`;
      case 'subscription-role-removed':
        return `removed ${message?.msg} as ${message?.role}`;
      case 'room_changed_privacy':
        return `changed room to ${message?.msg}`;
      case 'room-set-read-only':
        return 'set room to read only';
      case 'room-removed-read-only':
        return 'removed read only permission';
      case 'room-archived':
        return 'archived room';
      case 'room-unarchived':
        return 'unarchived room';
      case 'room-allowed-reacting':
        return 'allowed reactions';
      default:
        return '';
    }
  };

  if (!message.t) {
    return (
      <Box
        css={styles.header}
        className={appendClassNames('ec-message-header', classNames)}
        style={styleOverrides}
      >
        {showName && showNameGlobal && (
          <Box
            is="span"
            css={styles.headerName}
            className={appendClassNames('ec-message-header-name')}
          >
            {message.u?.name}
          </Box>
        )}
        {showUsername && (
          <Box
            is="span"
            css={styles.userName}
            className={appendClassNames('ec-message-header-username')}
          >
            @{message.u.username}
          </Box>
        )}
        {showRoles && isRoles && (
          <>
            {admins.includes(message?.u?.username) && (
              <Box
                as="span"
                css={styles.userRole}
                className={appendClassNames('ec-message-user-role')}
              >
                admin
              </Box>
            )}

            {channelLevelRoles[message.u.username]?.roles?.map(
              (role, index) => (
                <Box
                  key={index}
                  as="span"
                  css={styles.userRole}
                  className={appendClassNames('ec-message-user-role')}
                >
                  {role}
                </Box>
              )
            )}
          </>
        )}

        {isTimeStamped && (
          <Box
            is="span"
            css={styles.headerTimestamp}
            className={appendClassNames('ec-message-header-timestamp')}
          >
            {format(new Date(message.ts), 'h:mm a')}
          </Box>
        )}

        <Box css={styles.messageStatus}>
          {message.editedAt && (
            <Icon
              style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
              name="edit"
              size="1em"
              color={colors.primary}
            />
          )}
          {isStarred ? (
            <Tooltip text="Starred" position="top">
              <Icon
                style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
                name="star-filled"
                size="1em"
                color={colors.primary}
              />
            </Tooltip>
          ) : null}
          {isPinned ? (
            <Tooltip text="Pinned" position="top">
              <Icon
                style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
                name="pin"
                size="1em"
                color={colors.primary}
              />
            </Tooltip>
          ) : null}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      css={styles.header}
      className={appendClassNames('ec-message-header', classNames)}
      style={styleOverrides}
    >
      <Box
        is="span"
        css={styles.headerName}
        className={appendClassNames('ec-message-header-name')}
      >
        @{message.u.username}{' '}
      </Box>
      <Box
        is="span"
        css={styles.userName}
        className={appendClassNames('ec-message-header-username')}
        style={{ marginLeft: '2px' }}
      >
        {userActions()}
      </Box>
      <Box
        is="span"
        css={styles.headerTimestamp}
        className={appendClassNames('ec-message-header-timestamp')}
      >
        {format(new Date(message.ts), 'h:mm a')}
      </Box>
    </Box>
  );
};

export default MessageHeader;

MessageHeader.propTypes = {
  message: PropTypes.any,
};
