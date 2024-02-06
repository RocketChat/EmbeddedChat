import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { useUserStore } from '../../store';
import { Icon } from '../Icon';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';

const MessageHeaderCss = css`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 1;
  min-width: 1px;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
  margin-block: 0.125rem;
  gap: 0.125rem;
  align-items: center;
`;

const MessageHeaderNameCss = css`
  letter-spacing: 0rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  color: #2f343d;
`;

const MessageHeaderUsernameCss = css`
  letter-spacing: 0rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  color: #6c727a;
`;

const MessageHeaderTimestapCss = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  flex-shrink: 0;
  color: #9ea2a8;
`;

const MessageHeader = ({ message, isTimeStamped = true }) => {
  const { styleOverrides, classNames } = useComponentOverrides('MessageHeader');
  const roles = useUserStore((state) => state.roles);
  const authenticatedUserId = useUserStore((state) => state.userId);
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
      default:
        return '';
    }
  };

  const userRoles = roles[message.u.username]
    ? roles[message.u.username].roles
    : null;

  if (!message.t) {
    return (
      <Box
        css={MessageHeaderCss}
        className={appendClassNames('ec-message-header', classNames)}
        style={styleOverrides}
      >
        <Box
          is="span"
          css={MessageHeaderNameCss}
          className={appendClassNames('ec-message-header-name')}
        >
          {message.u?.name}
        </Box>
        <Box
          is="span"
          css={MessageHeaderUsernameCss}
          className={appendClassNames('ec-message-header-username')}
        >
          @{message.u.username}
        </Box>
        {/* TODO {userRoles
          ? userRoles.map((role, index) => (
              <Message.Role key={index}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Message.Role>
            ))
          : null} */}
        {isTimeStamped && <Box
          is="span"
          css={MessageHeaderTimestapCss}
          className={appendClassNames('ec-message-header-timestamp')}
        >
          {format(new Date(message.ts), 'h:mm a')}
        </Box>
        }
        {message.editedAt && (
          <Icon
            style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
            name="edit"
            size="1em"
          />
        )}
        {isStarred ? (
          <Icon
            style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
            name="star-filled"
            size="1em"
          />
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      css={MessageHeaderCss}
      className={appendClassNames('ec-message-header', classNames)}
      style={styleOverrides}
    >
      <Box
        is="span"
        css={MessageHeaderNameCss}
        className={appendClassNames('ec-message-header-name')}
      >
        @{message.u.username}{' '}
      </Box>
      <Box
        is="span"
        css={MessageHeaderUsernameCss}
        className={appendClassNames('ec-message-header-username')}
        style={{ marginLeft: '2px' }}
      >
        {userActions()}
      </Box>
      <Box
        is="span"
        css={MessageHeaderTimestapCss}
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
