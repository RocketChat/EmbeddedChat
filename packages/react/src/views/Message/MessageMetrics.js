import React from 'react';
import { css } from '@emotion/react';
import { formatDistance, format } from 'date-fns';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MessageMetricsStyles as styles } from './Message.styles';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const MessageMetrics = ({
  className = '',
  message,
  style = {},
  handleOpenThread = () => {},
  isReplyButton = true,
  variant,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageMetrics',
    className,
    style
  );

  const { colors } = useCustomTheme();
  return (
    <Box
      css={styles.metrics}
      className={appendClassNames('ec-message-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      {isReplyButton && (
        <Button
          size="small"
          onClick={handleOpenThread(message)}
          css={
            variant === 'bubble' &&
            css`
              background-color: ${colors.accent};
              color: ${colors.accentForeground};
              border-radius: 0.2rem;
            `
          }
        >
          {variant === 'bubble' ? (
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
      )}
      {variant !== 'bubble' && (
        <Box css={styles.metricsItem(true)} title="Replies">
          <Icon size="1.25rem" name="thread" />
          <Box css={styles.metricsItemLabel}>{message.tcount}</Box>
        </Box>
      )}
      {!!message.tcount && variant !== 'bubble' && (
        <Box css={styles.metricsItem} title="Participants">
          <Icon size="1.25rem" name="user" />
          <Box css={styles.metricsItemLabel}>{message.replies.length}</Box>
        </Box>
      )}
      {variant !== 'bubble' && (
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
      )}
    </Box>
  );
};
