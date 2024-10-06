import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Icon,
  useTheme,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { getMessageHeaderStyles } from './Message.styles';
import useDisplayNameColor from '../../hooks/useDisplayNameColor';
import useLayoutStore from '../../store/layoutStore';

const MessageHeader = ({ message, variantOverrides = 'normal' }) => {
  const displayName = useLayoutStore((state) => state.displayName);
  const displayNameVariant = displayName || variantOverrides;
  const styles = getMessageHeaderStyles(useTheme());
  const { theme } = useTheme();
  const getDisplayNameColor = useDisplayNameColor();

  return (
    <Box css={styles.header} className="ec-message-header">
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

      <Box
        is="span"
        css={styles.timestamp}
        className={appendClassNames('ec-message-header-timestamp')}
      >
        {format(new Date(message.ts), 'h:mm a')}
      </Box>

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
        </Box>
      )}
    </Box>
  );
};

export default MessageHeader;

MessageHeader.propTypes = {
  message: PropTypes.any,
};
