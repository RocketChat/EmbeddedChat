import React, { useState, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { Attachments } from '../AttachmentHandler';
import { useMessageStore, useUserStore, useMentionsStore } from '../../store';
import { MessageBody } from '../Message/MessageBody';
import { MessageMetrics } from '../Message/MessageMetrics';
import { Markdown } from '../Markdown';
import { MessageDivider } from '../Message/MessageDivider';
import MessageAvatarContainer from '../Message/MessageAvatarContainer';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import MessageHeader from '../Message/MessageHeader';
import Sidebar from '../Sidebar/Sidebar';
import { Throbber } from '../Throbber';
import styles from './UserMentions.styles';

const UserMentions = () => {
  const showAvatar = useUserStore((state) => state.showAvatar);
  const setShowMentions = useMentionsStore((state) => state.setShowMentions);
  const messages = useMessageStore((state) => state.messages);
  const authenticatedUserId = useUserStore((state) => state.userId);
  const [mentionedMessages, setMentionedMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const openThread = useMessageStore((state) => state.openThread);

  const toggleShowMentions = () => {
    setShowMentions(false);
  };
  const handleOpenThread = (msg) => () => {
    openThread(msg);
    toggleShowMentions(false);
  };
  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  useEffect(() => {
    setIsLoaded(false);
    const filtered = messages.filter(
      (message) =>
        'mentions' in message &&
        message.mentions.some((msg) => msg._id === authenticatedUserId)
    );
    setMentionedMessages(filtered);
    setIsLoaded(true);
  }, [authenticatedUserId, messages]);

  return (
    <Sidebar title="Mentions" iconName="at" setShowWindow={setShowMentions}>
      {isLoaded ? (
        <Box css={styles.userMentionsListContainer(mentionedMessages)}>
          {mentionedMessages.length === 0 ? (
            <Box css={styles.centeredColumnStyles}>
              <Icon
                name="magnifier"
                size="3rem"
                style={{ padding: '0.5rem' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                No mentions found
              </span>
            </Box>
          ) : (
            mentionedMessages.map((message, index, arr) => {
              const newDay =
                index === 0 || isMessageNewDay(message, arr[index - 1]);
              return (
                <Box key={message._id}>
                  {newDay ? (
                    <MessageDivider>
                      {format(new Date(message.ts), 'MMMM d, yyyy')}
                    </MessageDivider>
                  ) : null}
                  <Box css={styles.message}>
                    {showAvatar && (
                      <MessageAvatarContainer
                        message={message}
                        sequential={false}
                        isStarred={false}
                      />
                    )}
                    <MessageBodyContainer>
                      <MessageHeader message={message} />

                      <MessageBody>
                        {message.attachments &&
                        message.attachments.length > 0 ? (
                          <>
                            <Markdown body={message} isReaction={false} />
                            <Attachments attachments={message.attachments} />
                          </>
                        ) : (
                          <Markdown body={message} isReaction={false} />
                        )}
                      </MessageBody>

                      {!message.t && message.tcount && (
                        <MessageMetrics
                          message={message}
                          handleOpenThread={handleOpenThread}
                        />
                      )}
                    </MessageBodyContainer>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      ) : (
        <Box css={styles.centeredColumnStyles}>
          <Throbber />
        </Box>
      )}
    </Sidebar>
  );
};

export default UserMentions;
