import React from 'react';
import { formatDistance } from 'date-fns';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MessageMetricsStyles as styles } from './Message.styles';

export const MessageMetrics = ({
  className = '',
  message,
  style = {},
  handleOpenThread = () => {},
  isReplyButton = true,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageMetrics',
    className,
    style
  );
  return (
    <Box
      css={styles.metrics}
      className={appendClassNames('ec-message-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      {isReplyButton && (
        <Button size="small" onClick={handleOpenThread(message)}>
          Reply
        </Button>
      )}
      <Box css={styles.metricsItem(true)} title="Replies">
        <Icon size="1.25rem" name="thread" />
        <Box css={styles.metricsItemLabel}>{message.tcount}</Box>
      </Box>
      {!!message.tcount && (
        <Box css={styles.metricsItem} title="Participants">
          <Icon size="1.25rem" name="user" />
          <Box css={styles.metricsItemLabel}>{message.replies.length}</Box>
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
    </Box>
  );
};
