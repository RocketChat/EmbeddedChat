import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { isSameDay, format } from 'date-fns';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { Attachments } from '../Attachments';
import { useMessageStore, useUserStore, useMentionsStore } from '../../store';
import { MessageBody } from '../Message/MessageBody';
import { MessageMetrics } from '../Message/MessageMetrics';
import { useRCContext } from '../../context/RCInstance';
import { Markdown } from '../Markdown';
import { MessageDivider } from '../Message/MessageDivider';
import MessageAvatarContainer from '../Message/MessageAvatarContainer';
import MessageBodyContainer from '../Message/MessageBodyContainer';
import MessageHeader from '../Message/MessageHeader';
import Sidebar from '../Sidebar/Sidebar';

const MessageCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 0.5rem;
  -webkit-padding-before: 0.5rem;
  padding-block-start: 0.5rem;
  padding-bottom: 0.25rem;
  -webkit-padding-after: 0.25rem;
  padding-block-end: 0.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-inline: 1.25rem;
  &:hover {
    background: #f2f3f5;
  }
`;

const UserMentions = () => {
  const showAvatar = useUserStore((state) => state.showAvatar);
  const setShowMentions = useMentionsStore((state) => state.setShowMentions);
  const { RCInstance } = useRCContext();
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
    const fetchMentionedMsgs = async () => {
      const response = await RCInstance.getMentionedMessages();
      if (response && response.messages) {
        setMentionedMessages(response.messages);
        setIsLoaded(true);
      }
    };
    fetchMentionedMsgs();
  }, [RCInstance, setMentionedMessages]);

  return (
    <Sidebar title="Mentions" iconName="at" setShowWindow={setShowMentions}>
      {isLoaded && (
        <Box
          style={{
            flex: '1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent:
              mentionedMessages.length === 0 ? 'center' : 'initial',
            alignItems: mentionedMessages.length === 0 ? 'center' : 'initial',
            overflowX: 'hidden',
            maxWidth: '100%',
          }}
        >
          {mentionedMessages.length === 0 ? (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#4a4a4a',
              }}
            >
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
                <React.Fragment key={message._id}>
                  {newDay ? (
                    <MessageDivider>
                      {format(new Date(message.ts), 'MMMM d, yyyy')}
                    </MessageDivider>
                  ) : null}
                  <Box css={MessageCss}>
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
                </React.Fragment>
              );
            })
          )}
        </Box>
      )}
    </Sidebar>
  );
};

export default UserMentions;
