import React from 'react';
import { formatDistance } from 'date-fns';
import {
  Box,
  Button,
  Icon,
  useComponentOverrides,
  appendClassNames,
} from '@embeddedchat/ui-elements';
import { MessageMetricsStyles as styles } from './Message.styles';
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
              Reply
            </Button>
            <Box css={styles.metricsItem(true)} title="Replies">
              <Icon size="1.25rem" name="thread" />
              <Box css={styles.metricsItemLabel}>{message.tcount}</Box>
            </Box>
            {!!message.tcount && (
              <Box css={styles.metricsItem} title="Participants">
                <Icon size="1.25rem" name="user" />
                <Box css={styles.metricsItemLabel}>
                  {message.replies.length}
                </Box>
              </Box>
            )}
            <Box
              css={styles.metricsItem}
              title={new Date(message.tlm).toLocaleString()}
            >
              <Icon size="1.25rem" name="clock" />
              <Box css={styles.metricsItemLabel}>
                {formatDistance(new Date(message.tlm), new Date(), {
                  addSuffix: true,
                })}
              </Box>
            </Box>
          </>
        ))}
    </Box>
  );
};
