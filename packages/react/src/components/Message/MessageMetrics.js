import React from 'react';
import { css } from '@emotion/react';
import { formatDistance } from 'date-fns';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { Button } from '../Button';
import { Icon } from '../Icon';

const MessageMetricsCss = css`
  display: flex;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-inline: -0.25rem;
  margin-top: 0.5rem;
`;

const MessageMetricsItemCss = css`
  letter-spacing: 0rem;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.25rem;
  color: #6c727a;
`;

const FirstMessageMetricsItemCss = css`
  ${MessageMetricsItemCss};
  margin-left: 0.5rem;
`;

const MessageMetricsItemLabelCss = css`
  margin: 0.25rem;
  margin-inline-start: 0.25rem;
  white-space: nowrap;
`;

export const MessageMetrics = ({
  className = '',
  message,
  style = {},
  handleOpenThread = () => { },
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
      css={MessageMetricsCss}
      className={appendClassNames('ec-message-metrics', classNames)}
      style={styleOverrides}
      {...props}
    >
      {isReplyButton && <Button size="small" onClick={handleOpenThread(message)}>
        Reply
      </Button>}
      <div css={FirstMessageMetricsItemCss} title="Replies">
        <Icon size="1.25rem" name="thread" />
        <div css={MessageMetricsItemLabelCss}>{message.tcount}</div>
      </div>
      {!!message.tcount && (
        <div css={MessageMetricsItemCss} title="Participants">
          <Icon size="1.25rem" name="user" />
          <div css={MessageMetricsItemLabelCss}>{message.replies.length}</div>
        </div>
      )}
      <div
        css={MessageMetricsItemCss}
        title={new Date(message.tlm).toLocaleString()}
      >
        <Icon size="1.25rem" name="clock" />
        <div css={MessageMetricsItemLabelCss}>
          {formatDistance(new Date(message.tlm), new Date(), {
            addSuffix: true,
          })}
        </div>
      </div>
    </Box>
  );
};
