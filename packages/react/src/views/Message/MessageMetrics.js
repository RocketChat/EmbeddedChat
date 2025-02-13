import React, { useContext } from 'react';
import { formatDistance } from 'date-fns';
import {
  Box,
  Button,
  Icon,
  useComponentOverrides,
  appendClassNames,
  Avatar,
  Tooltip,
} from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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

  const participantsList =
    (message?.replies?.length ?? 0) - 1 > 0
      ? `+${message.replies.length - 1}`
      : null;

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
              {i18n.t('View_Thread')}
            </Button>
            {!!message.tcount && (
              <>
                <Tooltip text={i18n.t('Followers')} position="top">
                  <Box css={styles.metricsAvatarItem}>
                    <Avatar
                      url={getUserAvatarUrl(message?.u.username)}
                      alt="avatar"
                      size="1rem"
                    />
                    {participantsList && (
                      <span css={styles.metricsItemLabel}>
                        {participantsList}
                      </span>
                    )}
                  </Box>
                </Tooltip>
              </>
            )}

            <Tooltip
              text={i18n.t('Last_Message', {
                time: new Date(message.tlm).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }),
              })}
              position="top"
            >
              <Box css={styles.metricsItem(true)}>
                <Icon size="1.15rem" name="thread" />
                <Box css={styles.metricsItemLabel}>
                  {message.tcount} replies,{' '}
                  {new Date(message.tlm).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Box>
              </Box>
            </Tooltip>
          </>
        ))}
    </Box>
  );
};
