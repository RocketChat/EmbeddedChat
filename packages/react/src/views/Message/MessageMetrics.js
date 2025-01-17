import React, { useContext } from 'react';
import {
  Box,
  Button,
  Icon,
  useComponentOverrides,
  appendClassNames,
  Avatar,
} from '@embeddedchat/ui-elements';
import { MessageMetricsStyles as styles } from './Message.styles';
import RCContext from '../../context/RCInstance';

import BubbleThreadBtn from './BubbleVariant/BubbleThreadBtn';

export const MessageMetrics = ({
  className = '',
  message,
  style = {},
  handleOpenThread = () => {},
  isReplyButton = true,
  variantStyles = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageMetrics',
    className,
    style
  );

  const { RCInstance } = useContext(RCContext);

  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${username}`;
  };
  
  return (
    <Box
      css={variantStyles.metricsContainer || styles.metrics}
      className={appendClassNames('ec-message-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      {isReplyButton &&
        (variantStyles?.name?.includes('bubble') ? (
          <BubbleThreadBtn
            message={message}
            handleOpenThread={handleOpenThread}
            styles={variantStyles}
          />
        ) : (
          <>
            <Button
              size="small"
              onClick={handleOpenThread(message)}
              css={variantStyles && variantStyles.threadReplyButton}
            >
              View thread
            </Button>
            {!!message.tcount && (
              <>
                <Box css={styles.metricsItem} title="Participants">
                  <Avatar
                    url={getUserAvatarUrl(message?.u.username)}
                    alt="avatar"
                    size="1rem"
                  />
                </Box>
              </>
            )}

            <Box css={styles.metricsItem(true)} title="Replies">
              <Icon size="1.25rem" name="thread" />
              <Box css={styles.metricsItemLabel}>
                {message.tcount} replies,{' '}
                {new Date(message.tlm).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Box>
            </Box>
          </>
        ))}
    </Box>
  );
};
