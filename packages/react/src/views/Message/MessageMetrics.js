import React from 'react';
import { formatDistance, format } from 'date-fns';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MessageMetricsStyles as styles } from './Message.styles';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import useBubbleStyles from './BubbleVariant/useBubbleStyles';

export const MessageMetrics = ({
  className = '',
  message,
  style = {},
  handleOpenThread = () => {},
  isReplyButton = true,
  isBubble,
  isMe = false,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageMetrics',
    className,
    style
  );

  const { colors } = useCustomTheme();
  const { getBubbleStyles } = useBubbleStyles(isMe);

  return (
    <Box
      css={isBubble ? getBubbleStyles('metricsContainer') : styles.metrics}
      className={appendClassNames('ec-message-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      {isReplyButton && (
        <>
          {isBubble && (
            <Icon
              name="arc"
              size="30"
              fill="none"
              color={`${colors.accent}`}
              css={getBubbleStyles('arcIcon')}
            />
          )}
          <Button
            size="small"
            onClick={handleOpenThread(message)}
            css={isBubble && getBubbleStyles('threadReplyButton')}
          >
            {isBubble ? (
              <>
                {message.tcount} Replies
                <span style={{ margin: '0 0.25rem' }}>
                  {format(new Date(message.tlm), 'hh:mm a')}
                </span>
              </>
            ) : (
              'Reply'
            )}
          </Button>
        </>
      )}

      {!isBubble && (
        <>
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
        </>
      )}
    </Box>
  );
};
