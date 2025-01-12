import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Icon,
  Tooltip,
  useComponentOverrides,
  useTheme,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { useMemberStore, useUserStore } from '../../store';
import { getMessageHeaderStyles } from './Message.styles';
import useDisplayNameColor from '../../hooks/useDisplayNameColor';
import { useRCContext } from '../../context/RCInstance';

const MessageHeader = ({
  message,
  isTimeStamped = true,
  isRoles = false,
  showDisplayName = true,
}) => {
  const { styleOverrides, classNames, variantOverrides } =
    useComponentOverrides('MessageHeader');
  const { ECOptions } = useRCContext();
  const displayNameVariant = variantOverrides || 'normal';
  const { theme } = useTheme();
  const styles = getMessageHeaderStyles(theme);
  const getDisplayNameColor = useDisplayNameColor();

  const authenticatedUserId = useUserStore((state) => state.userId);
  const showUsername = ECOptions?.showUsername;
  const showName = ECOptions?.showName;
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
      case 'room_changed_announcement':
        return `changed announcement to: ${
          message?.msg && message.msg.length > 0 ? message.msg : '(none)'
        }`;
      case 'room_changed_description':
        return `changed description to: ${
          message?.msg && message.msg.length > 0 ? message.msg : '(none)'
        }`;
      case 'room_changed_topic':
        return `changed topic to: ${
          message?.msg && message.msg.length > 0 ? message.msg : '(none)'
        }`;
      default:
        return '';
    }
  };

  return (
    <Box
      css={styles.header}
      className={appendClassNames('ec-message-header', classNames)}
      style={styleOverrides}
    >
      {showDisplayName && showName && (
        <Box
          is="span"
          css={styles.name}
          className={appendClassNames('ec-message-header-name')}
          style={
            displayNameVariant === 'colorize'
              ? { color: getDisplayNameColor(message.u.username) }
              : null
          }
        >
          {message.u?.name}
        </Box>
      )}
      {showDisplayName && showUsername && (
        <Box
          is="span"
          css={styles.userName}
          className={appendClassNames('ec-message-header-username')}
          style={
            displayNameVariant === 'colorize'
              ? { color: getDisplayNameColor(message.u.username) }
              : null
          }
        >
          @{message.u.username}
        </Box>
      )}
      {!message.t && ECOptions?.showRoles && isRoles && (
        <>
          {admins?.includes(message?.u?.username) && (
            <Box
              as="span"
              css={styles.userRole}
              className={appendClassNames('ec-message-user-role')}
            >
              Admin
            </Box>
          )}

          {channelLevelRoles[message.u.username]?.roles?.map((role, index) => (
            <Box
              key={index}
              as="span"
              css={styles.userRole}
              className={appendClassNames('ec-message-user-role')}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Box>
          ))}
        </>
      )}
      {message.t && (
        <Box
          is="span"
          css={styles.userActions}
          className={appendClassNames('ec-message-header-useractions')}
          style={{ marginLeft: '2px' }}
        >
          {userActions()}
        </Box>
      )}

      {isTimeStamped && (
        <Box
          is="span"
          css={styles.timestamp}
          className={appendClassNames('ec-message-header-timestamp')}
        >
          {format(new Date(message.ts), 'h:mm a')}
        </Box>
      )}

      {!message.t && (
        <Box css={styles.messageStatus}>
          {message.editedAt && (
            <Icon
              style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
              name="edit"
              size="1em"
              color={theme.colors.primary}
            />
          )}
          {isStarred ? (
            <Tooltip text="Starred" position="top">
              <Icon
                style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
                name="star-filled"
                size="1em"
                color={theme.colors.primary}
              />
            </Tooltip>
          ) : null}
          {isPinned ? (
            <Tooltip text="Pinned" position="top">
              <Icon
                style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
                name="pin"
                size="1em"
                color={theme.colors.primary}
              />
            </Tooltip>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default MessageHeader;

MessageHeader.propTypes = {
  message: PropTypes.any,
};
