import React, { useContext, useState, useEffect } from 'react';
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
import { MessageMetricsStyles as styles } from './Message.styles';
import { getThreadFollowUnfollowButtonStyles as getThreadFollowUnfollowButtonStyles } from './Message.styles';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';

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
  const [followMessage, setFollowMessage] = useState(false);
  const [followedUsernames, setFollowedUsernames] = useState([]);
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageMetrics',
    className,
    style
  );

  const { RCInstance } = useContext(RCContext);
  const threadIdsWithNewReplies = useMessageStore(
    (state) => state.threadIdsWithNewReplies
  );
  const threadIdsWithMentions = useMessageStore(
    (state) => state.threadIdsWithMentions
  );
  const isThreadOpen = useMessageStore((state) => state.isThreadOpen);
  const hasNewReplyNoOpen = !!message._id && threadIdsWithNewReplies.includes(message._id) && !isThreadOpen;
  const hasMentionNoOpen = !!message._id && threadIdsWithMentions.includes(message._id) && !isThreadOpen;

  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    return `${host}/avatar/${username}`;
  };

  const participantsList =
    (message?.replies?.length ?? 0) - 1 > 0
      ? message.replies.length - 2 > 0
        ? `+${message.replies.length - 2}`
        : null
      : null;

  const getUserInfo = async (userId) => {
    const results = await RCInstance.userInfo(userId);
    return results;
  };

  useEffect(() => {
    const userDetails = async () => {
      const results = await Promise.all(
        message.replies.slice(0, 2).map((userId) => getUserInfo(userId))
      );

      const userNames = results.map((user) => user.user.username);
      setFollowedUsernames(userNames);
    };

    if (message.replies.length > 0) {
      userDetails();
    }
  }, [message.replies, followMessage]);

  const handleThreadFollow = async (messageId) => {
    if (followMessage) {
      const res = await RCInstance.followThread({
        mid: message._id,
      });
    } else {
      const res = await RCInstance.unfollowThread({
        mid: message._id,
      });
    }

    setFollowMessage(!followMessage);
  };

  const badgeColor = () => {
    if(hasNewReplyNoOpen && !hasMentionNoOpen) {
      return 'blue';
    }
    if(hasNewReplyNoOpen && hasMentionNoOpen) {
      return 'red';
    }
    return null;
  }

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
              style={{
                backgroundColor: hasNewReplyNoOpen || hasMentionNoOpen  ? "blue" : null
              }}  
            >
              View thread
            </Button>

            <Tooltip text={`${followMessage ? 'Unfollow' : 'Following'}`}>
              <Box
                style={{
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                <Icon
                  css={getThreadFollowUnfollowButtonStyles.notification}
                  style={{
                    position: 'relative',
                    width: 'fit-content',
                  }}
                  size="1.15rem"
                  name={followMessage ? 'bell-off' : 'bell'}
                  onClick={handleThreadFollow}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    transform: 'translate(50%, -50%)',
                    width: '0.6em',
                    height: '0.6em',
                    background: badgeColor(),
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                ></span>
              </Box>
            </Tooltip>

            {!!message.tcount && (
              <>
                <Tooltip text="Followers" position="top">
                  <Box css={styles.metricsAvatarItem}>
                    {followedUsernames.map((userName, index) => (
                      <Avatar
                        key={userName}
                        url={getUserAvatarUrl(userName)}
                        alt="avatar"
                        size="1rem"
                      />
                    ))}
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
              text={`Last message: ${new Date(message.tlm).toLocaleTimeString(
                [],
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }
              )}`}
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
